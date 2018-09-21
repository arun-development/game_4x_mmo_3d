using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using Server.Core.Images;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.DataLayer.LocalStorageCaches;
using Server.Extensions;
using Server.Modules.Localize;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.DataLayer.Repositories
{
    public interface IAllianceRepository : IAdapterDapper<alliance, AllianceDataModel, int>
    {
        bool DisbandAllianceProcedure(IDbConnection connection,int allianceId);
        IList<AllianceDataModel> GetAllActiveProcedure(IDbConnection connection);
        bool DeleteAllCascadeProcedure(IDbConnection connection);
        bool DeleteAllianceCascadeProcedure(IDbConnection connection, int id);
        AllianceNameSerchItem GetAllianceNameObj(IDbConnection connection, string allianceName);
        alliance GetTopAllianceInSector(IDbConnection connection, int sectorId);
    }

    public class AllianceRepository : AdapterDapperRepository<alliance, AllianceDataModel, int>,
        IAllianceRepository
    {
        public AllianceRepository(IDbProvider dataProvider) : base(dataProvider)
        {
 
        }


        /// <summary>
        ///   удаляет альянс и всех пользователей, транзакция в процедуре
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="allianceId"></param>
        public bool DisbandAllianceProcedure(IDbConnection connection, int allianceId)
        {
            ThrowIfConnectionIsNull(connection);
            if (allianceId == 0) throw new ArgumentException();
            var result = _provider.Procedure<bool>(connection, "alliance_disband_alliance", new
            {
                //@allianceId int,
                //@confederationAllianceId INT,
                //@recrutRoleId TINYINT, 
                //@armAllianceSourceType TINYINT,
                //@armUserSourceType TINYINT
                allianceId,
                confederationAllianceId = (byte)NpcAllianceId.Confederation,
                recrutRoleId = (byte)AllianceRoles.Recrut,
                armAllianceSourceType = (byte)MessageSourceType.IsAlliance,
                armUserSourceType = (byte)MessageSourceType.IsUser
            }).FirstOrDefault();
            if (!result) throw new NotImplementedException("unknown");
            return result;
        }

        public IList<AllianceDataModel> GetAllActiveProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            var data  = _provider.Procedure<alliance>(connection, "alliance_get_all_active").ToList();
            return ConvertToWorkModel(data);
        }


        public override AllianceDataModel ConvertToWorkModel(alliance entity)
        {
            return _convertFromEntity(entity);
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            throw new NotImplementedException();
        }

        public bool DeleteAllCascadeProcedure(IDbConnection connection)
        {
            ThrowIfConnectionIsNull(connection);
            return _provider.Procedure<bool>(connection, "alliance_delete_all_cascade").FirstOrDefault();

            //var alliance = c.alliance_delete_all().First().sucsess ?? false;
            //if (!alliance) throw new NotImplementedException(nameof(c.alliance_delete_all));
            //c.help_reset_index("alliance", 0);

            //var allianceUsers = c.alliance_user_delete_all().First().sucsess ?? false;
            //if (!allianceUsers) throw new NotImplementedException(nameof(c.alliance_user_delete_all));
            //c.help_reset_index("alliance_user", 0);

            //var allianceUsersHistory = c.alliance_user_history_delete_all().First().sucsess ?? false;
            //if (!allianceUsersHistory)
            //    throw new NotImplementedException(nameof(c.alliance_user_history_delete_all));
            //c.help_reset_index("alliance_user_history", 1);


            //var arm = c.alliance_request_message_delete_all().First().sucsess ?? false;
            //if (!arm) throw new NotImplementedException(nameof(c.alliance_request_message_delete_all));
            //c.help_reset_index("alliance_request_message", 1);

            //var armHistory = c.alliance_request_message_history_delete_all().First().sucsess ?? false;
            //if (!armHistory)
            //    throw new NotImplementedException(nameof(c.alliance_request_message_history_delete_all));
            //c.help_reset_index("alliance_request_message_history", 1);

            //var fleet = c.alliance_fleet_delete_all().First().sucsess ?? false;
            //if (!fleet) throw new NotImplementedException(nameof(c.alliance_fleet_delete_all));
            //c.help_reset_index("alliance_fleet", 1);

            //var allianceTech = c.alliance_tech_delete_all().First().sucsess ?? false;
            //if (!allianceTech) throw new NotImplementedException(nameof(c.alliance_tech_delete_all));
        }

        public bool DeleteAllianceCascadeProcedure(IDbConnection connection,int id)
        {
            ThrowIfConnectionIsNull(connection);
            if (id == default(int))
                throw new ArgumentNullException(nameof(id), Error.InputDataIncorrect);
            var result = false;
            result = _provider.Procedure<bool>(connection, "alliance_delete_cascade_alliance_item", new
            {
                allianceId = id,
                allianceSourceTypeId = (byte)MessageSourceType.IsAlliance,
                userSourceTypeId = (byte)MessageSourceType.IsUser
            }).FirstOrDefault();
            return result;
        }

        public AllianceNameSerchItem GetAllianceNameObj(IDbConnection connection, string allianceName)
        {
            ThrowIfConnectionIsNull(connection);
            var sql = $"select top 1 Id,name as Name,disbandet as Disbandet from  {SchemeTableName} where name={allianceName};";
            return _provider.Text<AllianceNameSerchItem>(connection, sql).FirstOrDefault();
        }

        public alliance GetTopAllianceInSector(IDbConnection connection, int sectorId)
        {
            ThrowIfConnectionIsNull(connection);
            //todo  проверить запрос!
            var systemTbName = _provider.GetTableName(nameof(g_system));
            var systemDetailTbName = _provider.GetTableName(nameof(g_detail_system));
            var sql = $"SELECT TOP 1 a.* FROM {systemTbName} AS s " +
                      $"LEFT JOIN {systemDetailTbName} AS sd ON s.Id=sd.Id " +
                      $"LEFT JOIN {SchemeTableName} AS a ON sd.allianceId =a.Id " +
                      $"ORDER BY a.pvpRating DESC ";
            return _provider.Text<alliance>(connection, sql).FirstOrDefault();

        }


        protected override void _setUpdatedData(alliance oldData, AllianceDataModel newData)
        {
            if (newData.Images == null) throw new ArgumentNullException(Error.NoData, nameof(newData.Images));
            var images = newData.Images.ToSerealizeString();
            if (newData.Description != null && newData.Description.Length > L10N.DefaultMaxLength)
                throw new ValidationException(Error.OverMaxLength);
            if (images.Length > UserImageModel.DefaultMaxLength) throw new ValidationException(Error.OverMaxLength);
            if (oldData.Id != newData.Id) oldData.Id = newData.Id;
            if (oldData.name != newData.Name) oldData.name = newData.Name;
            if (oldData.creatorId != newData.CreatorId) oldData.creatorId = newData.CreatorId;
            if (oldData.creatorName != newData.CreatorName) oldData.creatorName = newData.CreatorName;
            if (oldData.dateCreate != newData.DateCreate) oldData.dateCreate = newData.DateCreate;
            if (oldData.dateDisband != newData.DateDisband) oldData.dateDisband = newData.DateDisband;
            if (oldData.description != newData.Description) oldData.description = newData.Description;


            if (oldData.images != images) oldData.images = images;
            if (oldData.pvpRating != newData.PvpRating) oldData.pvpRating = newData.PvpRating;
            if (oldData.tax != newData.Tax) oldData.tax = newData.Tax;
            if (oldData.cc != newData.Cc) oldData.cc = newData.Cc;
        }


        private static AllianceDataModel _convertFromEntity(IAllianceDbItem data)
        {
            var result = new AllianceDataModel();
            if (data == null) return result;
            result.Id = data.Id;
            result.Name = data.name;
            result.CreatorId = data.creatorId;
            result.CreatorName = data.creatorName;
            result.DateCreate = data.dateCreate;
            result.DateDisband = data.dateDisband ?? 0;
            result.Description = data.description;
            result.Images = Label.GetFileUrls(data.images);
            result.PvpRating = data.pvpRating;
            result.Tax = data.tax;
            result.Cc = data.cc;
            return result;
        }
    }
}