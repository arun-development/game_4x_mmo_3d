using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.Extensions;
using Server.ServicesConnected.AzureStorageServices.ImageService;
 

namespace Server.Services.Confederation
{
    public partial class ConfederationService
    {
        private List<IOfficerOut> _getOfficerOutList(List<IUserOfficerOut> userOfficers)
        {
            var outOfficers = new List<IOfficerOut>();
            if (userOfficers == null)
            {
                return outOfficers;
            }
            foreach (var baseOfficer in OfficerHelper.GetOfficers())
            {
                var type = baseOfficer.Type;
                var users = userOfficers.Where(i => i.Type == type).ToList();
                if (users.Count > 2)
                {
                    throw new NotImplementedException("users.Count > 2");
                }

                var elected = users.Single(i => i.Elected);
                IUserOfficerOut app = null;
                var appUserOut = users.SingleOrDefault(i => !i.Elected);
                if (appUserOut != null)
                {
                    app = appUserOut;
                }
                else if (type != OfficerTypes.President)
                {
                    app = new UserOfficerOut(false, type);
                }
                var userOfficer = new OfficerOut(baseOfficer, elected, app);
                outOfficers.Add(userOfficer);
            }
            return outOfficers.OrderBy(i => i.Type).ToList();
        }


        private List<IUserOfficerOut> _getUserOfficerOutFromDb(IDbConnection c)
        {
            var oficerType = typeof(OfficerTypes);
            var p = _officerRepository.Provider;
            var ofTableName = p.GetTableName(nameof(c_officer));
            var userTableName = p.GetTableName(nameof(user));
            var allianceTableName = p.GetTableName(nameof(alliance));
            var sql = @"SELECT 
                        o.Id as Id,
                        o.officerType as Type,
                        o.userId as UserId,
                        o.allianceId as AllianceId,
                        o.elected as Elected,
                        o.dateStart as DateStart,
                        o.dateEnd as DateEnd,
                        o.appointedUserId as AppointedUserId,
                        u.nickname as UserName,
                        u.avatarUrls as UserAvatar,
                        a.name as AllianceName,
                        a.images as AllianceLabel from " + ofTableName + " as o " +
                      "LEFT  JOIN " + userTableName + " as u on o.userId =u.Id " +
                      "LEFT  JOIN " + allianceTableName + " as a on o.allianceId =a.Id";

            var dataOfficers = p.Text<dynamic>(c, sql).Select(i => (IUserOfficerOut) new UserOfficerOut
            {
                Id = i.Id,
                Type = (OfficerTypes) Enum.Parse(oficerType, i.Type.ToString()),
                UserId = i.UserId,
                AllianceId = i.AllianceId,
                Elected = i.Elected,
                DateStart = i.DateStart,
                DateEnd = i.DateStart,
                AppointedUserId = i.AppointedUserId,
                UserName = i.UserName,
                UserAvatar = Avatar.GetFileUrls(i.UserAvatar),
                AllianceName = i.AllianceName,
                AllianceLabel = Label.GetFileUrls(i.AllianceLabel)
            }).ToList();
            return dataOfficers;
        }

        private void _rebuildWeekOfficers(List<IUserOfficerOut> newOfficers)
        {
            if (_weekOfficersStorage != null)
            {
                _weekOfficersStorage.Clear();
                _weekOfficersStorage = null;
            }

            _weekOfficersStorage =
                new ConcurrentDictionary<OfficerTypes, IOfficerOut>(_getOfficerOutList(newOfficers)
                    .ToDictionary(i => i.Type, i => i));
        }


        #region Public interface

        public List<IOfficerOut> GetOfficers(IDbConnection connection, bool periodIsCheked)
        {
            if (!periodIsCheked)
            {
                _checkAndRunVoteState(connection);
            }
            //todo comparer string or byte?
            if (_weekOfficersStorage != null && !_weekOfficersStorage.IsEmpty)
            {
                return _weekOfficersStorage.Select(i => i.Value).OrderBy(i => i.Type).ToList();
            }
            List<IUserOfficerOut> dataOfficers = null;
            dataOfficers = _getUserOfficerOutFromDb(connection);

            if (dataOfficers == null || !dataOfficers.Any())
            {
                return null; // todo  сделать что то с состоянием до первых выборов

                throw new ArgumentNullException(nameof(dataOfficers), Error.NoData);
            }
            if (dataOfficers.Count > MAX_OFFICERS_COUNT)
            {
                throw new NotImplementedException("dataOfficers.Count > MAX_OFFICERS_COUNT");
            }
            _rebuildWeekOfficers(dataOfficers);
            if (_weekOfficersStorage == null || _weekOfficersStorage.IsEmpty)
            {
                throw new NotImplementedException(
                    "_weekOfficersStorage == null || _weekOfficersStorage.IsEmpty after try trestore");
            }
            return _weekOfficersStorage?.Select(i => i.Value).OrderBy(i => i.Type).ToList();
        }

        public IUserOfficerOut SetNewOfficerByPresident(IDbConnection connection, IUserOfficerOut newOfficer, int presidentOfficerId, int presidentUserId)
        {
            var dataRestored = false;
            if (_weekOfficersStorage == null || _weekOfficersStorage.IsEmpty)
            {
                dataRestored = true;
                GetOfficers(connection,false);
            }
            if (newOfficer.Type == OfficerTypes.President)
            {
                throw new SecurityException(Error.NotPermitted);
            }
            if (newOfficer.Elected)
            {
                throw new Exception(Error.InputDataIncorrect);
            }


            IOfficerOut presidentOut;
            // ReSharper disable once PossibleNullReferenceException
            var hasPresident = _weekOfficersStorage.TryGetValue(OfficerTypes.President, out presidentOut);
            if (!hasPresident)
            {
                if (dataRestored)
                {
                    throw new ArgumentNullException(nameof(presidentOut));
                }

                GetOfficers(connection,false);
                hasPresident = _weekOfficersStorage.TryGetValue(OfficerTypes.President, out presidentOut);
                if (!hasPresident)
                {
                    throw new ArgumentNullException(nameof(presidentOut));
                }
                dataRestored = true;
            }
            if (presidentOut.Elected.Id != presidentOfficerId || presidentOut.Elected.UserId != presidentUserId)
            {
                throw new SecurityException(Error.NotPermitted);
            }
            var president = presidentOut.Elected;
            IOfficerOut officerOut;
            var hasOfficerOut = _weekOfficersStorage.TryGetValue(newOfficer.Type, out officerOut);
            if (!hasOfficerOut || officerOut.Appointed == null)
            {
                if (dataRestored)
                {
                    if (!hasOfficerOut)
                    {
                        throw new ArgumentNullException(nameof(officerOut));
                    }
                    if (officerOut.Appointed == null)
                    {
                        throw new NotImplementedException("officerOut.Appointed == null");
                    }
                }

                GetOfficers(connection,false);
                hasOfficerOut = _weekOfficersStorage.TryGetValue(newOfficer.Type, out officerOut);
                if (!hasOfficerOut)
                {
                    throw new ArgumentNullException(nameof(officerOut));
                }
                if (officerOut.Appointed == null)
                {
                    throw new NotImplementedException("officerOut.Appointed == null");
                }
                dataRestored = true;
            }
            if (officerOut.Appointed.Id != 0)
            {
                throw new Exception(Error.OfficerIsAlreadyExist);
            }

            var chek = _officerRepository.GetTopOfficerByUserId(connection, newOfficer.UserId);
            if (chek != null)
            {
                throw new Exception(Error.OfficerIsAlreadyExist);
            }
 
            var allianceUserTableName = _provider.GetTableName(nameof(alliance_user));
            var allianceTableName = _provider.GetTableName(nameof(alliance_user));
            var userTableName = _provider.GetTableName(nameof(user));
 

            var sqlAdvancdData = $"SELECT  TOP 4 " +
                                 @"u.Id as userId, " +
                                 @"u.avatarUrls as userAvatar, " +
                                 @"u.nickname as userName, " +
                                 @"u.pvpPoint as userPvpPoint, " +
                                 @"a.Id as allianceId, " +
                                 @"a.name as allianceName, " +
                                 @"a.images as allianceLabel " +
                                 $"FROM {allianceUserTableName} as au  " +
                                 $"JOIN {allianceTableName} as a ON a.Id = au.allianceId " +
                                 $"JOIN {userTableName} as u ON u.Id = au.userId " +
                                 $"WHERE au.userId = {newOfficer.UserId}";

            var targetData = _provider.Text<dynamic>(connection, sqlAdvancdData).Select(i => new WinnerCandidat(i))
                .FirstOrDefault();
            if (targetData == null)
            {
                throw new NotImplementedException();
            }
            newOfficer.AllianceLabel = Label.GetFileUrls(targetData.AllianceLabel);
            newOfficer.AllianceName = targetData.AllianceName;
            newOfficer.AllianceId = targetData.AllianceId;
            newOfficer.AppointedUserId = president.UserId;

            newOfficer.UserAvatar = Avatar.GetFileUrls(targetData.UserAvatar);
            newOfficer.UserName = targetData.UserName;


            // todo  set bonus to alliance
         
            var newOfficerData = _officerRepository.AddOrUpdate(connection,new c_officer
            {
                userId = newOfficer.UserId,
                allianceId = newOfficer.AllianceId,
                elected = false,
                officerType = (byte)newOfficer.Type,
                dateEnd = president.DateEnd,
                dateStart = UnixTime.UtcNow(),
                appointedUserId = president.UserId
            });

            newOfficer.Id = newOfficerData.Id;
            officerOut.Appointed = newOfficer;
            
            
            var suc = _weekOfficersStorage.AddOrUpdateSimple(officerOut.Type, officerOut);
            if (suc == default(IOfficerOut))
            {
                throw new NotImplementedException("Oficer not set in local instance");
            }
            return newOfficer;
        }


        /// <summary>
        ///     ищет кандидата с указанным альянсом и возвращает рассовый бонус в пересчете с % на значения (поделены на 100)
        ///     Иначе возвращает модель со значениями 0 0
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceId"></param>
        /// <returns></returns>
        public IBattleStatsDouble GetOfficerBonus(IDbConnection connection, int allianceId)
        {
            if (allianceId == 0)
            {
                throw new Exception(Error.NoData);
            }
            var officers = GetOfficers(connection,false);

            if (officers == null || !officers.Any())
            {
                return new BattleStatsDouble(0, 0);
            }
            var outOfficers = new List<IUserOfficerOut>();
            officers.ForEach(i =>
            {
                
                outOfficers.Add(i.Elected);
                if (i.Appointed != null && i.Appointed.Id != 0)
                {
                    outOfficers.Add(i.Appointed);
                }
            });

            var officer = outOfficers.FirstOrDefault(i => i.AllianceId == allianceId);
            return officer == null
                ? new BattleStatsDouble(0, 0)
                : officers.First(i => i.Type == officer.Type).Stats.DoubleStats;
        }

        #endregion
    }
}