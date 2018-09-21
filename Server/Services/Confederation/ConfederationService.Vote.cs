using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces.Confederation;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.EndPoints.Hubs.GameHub;
using Server.Extensions;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.Confederation
{
    public enum VoteStates : byte
    {
        Undefined = 0,
        StartedRunned = 1,
        StartedNotRunned = 2,
        StartedErrorInRun = 3,
        EndedFinished = 4,
        EndedNotFinished = 5,
        EndedErrorInFinished = 6,

        StartInProgress = 7,
        EndInProgress = 8,
        Locked = 9
    }

    /// <summary>
    ///     Этот модуль один сплошной костыль, надо разработать более понятную систему
    /// </summary>
    public partial class ConfederationService
    {
        #region Declare

        private const int START_END_VOTING_HOUR = 20;
        private const int MAX_OFFICERS_COUNT = 7;
        private const int MAX_CANDIDATES_COUNT = (int)MaxLenghtConsts.MaxOfficerCandidates;
        private const int REGISTER_CANDIDATE_CC_PRICE = 100;
        private const int START_VOTE_DAY = (int)DayOfWeek.Friday;
        private const int ONE_WEEK_DELTA_SECOND = UnixTime.OneWeekInSecond;
        private const int MAX_LIMIT_TRY = 5;
        private const int DELAY_BETWEEN_ERRORS = 100;

        private static VoteStates _voteSate = VoteStates.Undefined;

        private static ConcurrentDictionary<OfficerTypes, IOfficerOut> _weekOfficersStorage;
        private static ActiveCandidates _activeCandidates;
        private static int _startRegistrationTime; // WARN IS STATIC FIELD

        #region  Fields

        private int _endVotingTime;
        private int _startVotingTime;

        private IHubContext<MainGameHub> _hub => _svp.GetService<IHubContext<MainGameHub>>();

        public int StartRegistrationTime
        {
            get
            {
                if (_startRegistrationTime != 0 && UnixTime.UtcNow() - _startRegistrationTime < ONE_WEEK_DELTA_SECOND)
                {
                    return _startRegistrationTime;
                }
                var currTime = DateTime.UtcNow;
                var dayOfWeek = UnixTime.GetDayOfWeekFixed(currTime.DayOfWeek);
                if (dayOfWeek == 7)
                {
                    var hour = currTime.Hour;
                    if (hour >= START_END_VOTING_HOUR)
                    {
                        dayOfWeek = 0;
                    }
                }
                var lastSunDay = currTime.AddDays(-dayOfWeek);
                var lastSunDt = new DateTime(lastSunDay.Year, lastSunDay.Month, lastSunDay.Day, START_END_VOTING_HOUR,
                    0, 0);
                _startRegistrationTime = UnixTime.ToTimestamp(lastSunDt);
                return _startRegistrationTime;
            }
        }

        public int StartVoteTime
        {
            get
            {
                if (_startVotingTime != 0)
                {
                    return _startVotingTime;
                }
                var dt = UnixTime.ToDateTime(StartRegistrationTime);
                _startVotingTime = UnixTime.ToTimestamp(dt.AddDays(START_VOTE_DAY));
                return _startVotingTime;
            }
        }

        public int EndVoteTime
        {
            get
            {
                if (_endVotingTime != 0)
                {
                    return _endVotingTime;
                }
                _endVotingTime = StartRegistrationTime + ONE_WEEK_DELTA_SECOND - 1;
                return _endVotingTime;
            }
        }

        public bool VotingInProgress
        {
            get
            {
                var time = UnixTime.UtcNow();
                return time >= StartVoteTime && time <= EndVoteTime;
            }
        }

        #endregion

        #endregion

        #region Interface

        public void OnAppStart(IDbConnection connection)
        {
            _checkAndRunVoteState(connection);
        }

        public void OnAppStop()
        {
            _voteSate = VoteStates.Undefined;
            if (_weekOfficersStorage != null)
            {
                _weekOfficersStorage.Clear();
                _weekOfficersStorage = null;
            }
            // ReSharper disable once RedundantCheckBeforeAssignment
            if (_activeCandidates == null)
            {
                return;
            }
            _activeCandidates.Dispose();
            _activeCandidates = null;
        }

        #endregion

        #region Members

        private void _undefinedStateInVotePeriod(IDbConnection connection, bool notifyClients,
            int startRegistrationTime, int countError)
        {
            var candidatTbName = _provider.GetTableName(nameof(c_officer_candidat));
            ;
            var maxCandidatSql = $"SELECT TOP 1 * FROM {candidatTbName} ORDER BY Id DESC";
            var maxCandidat = _provider.Text<c_officer_candidat>(connection, maxCandidatSql).FirstOrDefault();
            if (countError > MAX_LIMIT_TRY)
            {
                throw new NotImplementedException(Error.VotingRunnerTryErrorMoreMaxLimit);
            }

            try
            {
                //todo это первый запуск приложения. зарегестрированных даннх нет  или никто не зарегестрировался
                if (maxCandidat == null)
                {
                    //  создать офицеров и кандидатов
                    _undefinedStateInRegistratedPeriod(connection, false, countError);
                    // сбросить состояние на текущее
                    _voteSate = VoteStates.StartInProgress;
                    // нжно перезапросить данные после обновления и  войти в другую ветку условия
                    _undefinedStateInVotePeriod(connection, notifyClients, startRegistrationTime, countError);
                }

                // данные верны, это текущий период необходимо восстановить данные текущего переиода и поднять кеши
                else if (maxCandidat.dateCreate >= startRegistrationTime)
                {
                    // этот кандидат прошол отбор в голосование. голосование  идет, заполняем кеш
                    if (maxCandidat.isFinalizer)
                    {
                        _fillActiveCandidatesFromDb(connection);
                        _voteSate = VoteStates.StartedRunned;
                        //   _endVoting(null,c);
                    }
                    // кандидат не проходил в голосование, проверить начиналась ли процедура голосования                  
                    else
                    {
                        //проверка начиналось ли голосование находится внутри, выбросит исключение
                        _startVoting(connection, null, notifyClients);
                    }
                }
                //это кандидаты прошлой недели, нужно проверить текущих офицеров, является ли кандидат офицером, и очистить прошлый период 
                //maxCandidat.dateCreate < startRegistrationTime
                else
                {
                    // этот кандидат  проходил отбор он может быть а может и не быть офицером
                    //логика переносит кандидатов прошлой недели в кандидат хистори
                    if (maxCandidat.isFinalizer)
                    {
                        // стереть данные в кеше если есть для верного результата
                        if (_weekOfficersStorage != null && !_weekOfficersStorage.IsEmpty)
                        {
                            _weekOfficersStorage.Clear();
                            _weekOfficersStorage = null;
                        }
                        var officers = GetOfficers(connection, true);

                        if (officers == null || !officers.Any())
                        {
                            _voteSate = VoteStates.StartedErrorInRun;
                            throw new NotImplementedException("officers == null || !officers.Any()");
                        }
                        // незнаю что это значит,  что то сделать
                        _voteSate = VoteStates.StartedErrorInRun;
                        throw new NotImplementedException();
                        //_voteSate = VoteStates.StartedRunned;
                    }
                    /*прошлые выборы были не завершенны корректно.
                    офицеры не назначены, процедура голосвания не начата данных для восстановления недостаточно, 
                    необходимо дополнительное вмешательство*/
                    throw new NotImplementedException(
                        "прошлые выборы были  завершенны не корректно. офицеры не назначены, процедура голосвания не начата");
                }
            }
            catch (Exception e)
            {
                _voteSate = VoteStates.StartedErrorInRun;
                Console.WriteLine(e);
                throw;
            }
        }

        private void _undefinedStateInRegistratedPeriod(IDbConnection connection, bool notifyClients, int countError)
        {
            _voteSate = VoteStates.EndInProgress;
            try
            {
                var firstOfficer = _getFirstOfficer(connection);
                // данных нет, база пуста это 1 й запуск, создаем  любых офицеров в обход голосования
                if (firstOfficer == null)
                {
                    var userTableName = _provider.GetTableName(nameof(user));
                    var allianceUserTableName = _provider.GetTableName(nameof(alliance_user));
                    var allianceTableName = _provider.GetTableName(nameof(alliance));

                    var sqlAdvancdData = @"SELECT  TOP 4 " +
                                         @"u.Id as userId, " +
                                         @"u.avatarUrls as userAvatar, " +
                                         @"u.nickname as userName, " +
                                         @"u.pvpPoint as userPvpPoint, " +
                                         @"a.Id as allianceId, " +
                                         @"a.name as allianceName, " +
                                         @"a.images as allianceLabel " +
                                         $@"FROM {userTableName} AS u " +
                                         $@"JOIN {allianceUserTableName} AS au ON au.userId=u.Id " +
                                         $@"JOIN {allianceTableName} AS a ON a.Id=au.allianceId " +
                                         @"WHERE u.isNpc=0 AND u.Id>1000 ";
                    var dataWinners = _provider.Text<dynamic>(connection, sqlAdvancdData);
                    var winners = dataWinners.Select(i => new WinnerCandidat(i)).OrderByDescending(i => i.UserPvpPoint)
                        .ToList();
                    if (winners.Count < 4)
                    {
                        throw new NotImplementedException("winners.Count < 4");
                    }


                    var candidates = winners.Select(i => new CandidatOut { UserId = i.UserId }).ToList();
                    foreach (var candidat in candidates)
                    {
                        _createAndSaveNewCandidate(connection, candidat, true);
                    }
                    var officers = _buildOfficers(connection, StartRegistrationTime, winners);
                    _rebuildWeekOfficers(officers);
                    _voteSate = VoteStates.EndedFinished;
                }
                //этот офицер из прошлой недели, новых назначений небыло, нужно завершить процедуру голосвания
                else if (firstOfficer.dateEnd <= StartRegistrationTime)
                {
                    //сбрасываем состояния чтобы небыло исключения
                    _voteSate = VoteStates.Undefined;
                    _endVoting(connection, null, notifyClients);
                }
                //эот обычный период не требующий дествий,взвращаем управление проверке данных с указанным состоянием
                else
                {
                    //заполняем кеш офицерами если его нет в инсте
                    GetOfficers(connection, true);
                    //снимаем блокировку для входа
                    _checkAndRunVoteStateLocked = false;
                    // состояние определено
                    _voteSate = VoteStates.EndedFinished;
                    // определить дальнейшие действия
                    _checkAndRunVoteState(connection, countError);
                    //todo  не верно, этот сценарий перезапишет и сресетит данные, а необходимо выгрузить данные в этом состоянии
                    //  _endVoting(null, c, notifyClients);
                }
            }
            catch (Exception e)
            {
                _voteSate = VoteStates.EndedErrorInFinished;
                Console.WriteLine(e);
                throw;
            }
        }

        #region _checkAndRunVoteState

        private static bool _checkAndRunVoteStateLocked;
        private static readonly object _checkAndRunVoteStateLocker = new object();

        private void _checkAndRunVoteState(IDbConnection connection, int countError = 0, bool notifyClients = true,
            Exception exception = null)
        {
            void Unlock()
            {
                _checkAndRunVoteStateLocked = false;
            }

            lock (_checkAndRunVoteStateLocker)
            {
                if (countError > MAX_LIMIT_TRY)
                {
                    Unlock();
                    throw new Exception(Error.VotingRunnerTryErrorMoreMaxLimit, exception);
                }
                if (_checkAndRunVoteStateLocked)
                {
                    Task.Delay(DELAY_BETWEEN_ERRORS).MakeSync();
                    countError++;
                    _checkAndRunVoteState(connection, countError, notifyClients);

                }
                else
                {
                    try
                    {
                        _checkAndRunVoteStateLocked = true;
                        var voteInProgress = VotingInProgress;
                        var startRegistrationTime = StartRegistrationTime;


                        if (_voteSate == VoteStates.Undefined)
                        {
                            #region модуль не инициализированн  app initialized need  restore data

                            if (countError != 0)
                            {
                                throw new NotImplementedException("_voteSate == VoteStates.Undefined");
                            }
                            if (voteInProgress)
                            {
                                _undefinedStateInVotePeriod(connection, notifyClients, startRegistrationTime, countError);
                            }
                            else
                            {
                                _undefinedStateInRegistratedPeriod(connection, notifyClients, countError);
                            }

                            #endregion
                        }

                        else
                        {
                            #region Текущее время соответствует периоду голосования

                            if (voteInProgress)
                            {
                                #region Все ок

                                // ReSharper disable once ConvertIfStatementToSwitchStatement

                                if (_voteSate == VoteStates.StartedRunned)
                                {
                                    return;
                                }

                                #endregion

                                #region внешняя ошибка в периоде голосования необходимо дополнительное вмешательство для фиксации

                                if (_voteSate == VoteStates.StartedErrorInRun)
                                {
                                    throw new Exception(Error.VotingRunnerStartedErrorInRun);
                                }

                                #endregion

                                #region  это данные предыдущего состояния, переключаем на голосование

                                if (_voteSate == VoteStates.EndedFinished)
                                {
                                    _startVoting(connection, null, notifyClients);
                                }

                                #endregion

                                #region данные назначаются необходимо подождать результатов для определения

                                else if (_voteSate == VoteStates.StartInProgress)
                                {
                                    Unlock();
                                    _checkAndRunVoteState(connection, countError, exception: exception);

                                    // _startVoting(connection, null, notifyClients);
                                }

                                #endregion

                                #region неопределенное стосояние в периоде голосвания, не относится к обрабатываемым сценариям 

                                else
                                {
                                    _voteSate = VoteStates.Undefined;
                                    throw new NotImplementedException(
                                        "неопределенное стосояние в периоде голосвания, не относится к обрабатываемым сценариям ");
                                }

                                #endregion
                            }

                            #endregion

                            #region  Текущее время соответствует периоду регистрации

                            else
                            {
                                #region все ok

                                // ReSharper disable once ConvertIfStatementToSwitchStatement
                                // ReSharper disable once RedundantJumpStatement
                                if (_voteSate == VoteStates.EndedFinished)
                                {
                                    return;
                                }

                                #endregion


                                #region  период голосования  не завершен, завершаем период

                                if (_voteSate == VoteStates.StartedRunned)
                                {
                                    _endVoting(connection, notifyClients: notifyClients);
                                }

                                #endregion

                                #region внешняя ошибка в периоде регистрации необходимо дополнительное вмешательство для фиксации

                                else if (_voteSate == VoteStates.EndedErrorInFinished)
                                {
                                    throw new Exception(Error.VotingRunnerEndedErrorInFinished);
                                }

                                #endregion

                                #region  модуль не инициализированн  app initialized need  restore data

                                #endregion

                                #region данные назначаются необходимо подождать результатов для определения

                                else if (_voteSate == VoteStates.EndInProgress)
                                {
                                    try
                                    {
                                        Unlock();
                                        _checkAndRunVoteState(connection, countError, notifyClients);
                                    }
                                    catch (Exception e)
                                    {
                                        if (_voteSate == VoteStates.StartInProgress)
                                        {
                                            Unlock();
                                            _checkAndRunVoteState(connection, countError, notifyClients, e);
                                        }
                                        else
                                        {
                                            throw;
                                        }
                                    }
                                }

                                #endregion

                                #region неопределенное стосояние в периоде регистрации, не относится к обрабатываемым сценариям

                                else
                                {
                                    _voteSate = VoteStates.Undefined;
                                    throw new NotImplementedException("неопределенное стосояние в периоде регистрации, не относится к обрабатываемым сценариям");
                                }

                                #endregion
                            }

                            #endregion
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        throw;
                    }
                    finally
                    {
                        Unlock();
                    }


                }


            }
        }

        #endregion


        private List<CandidatOut> _startVotingDb(IDbConnection connection)
        {
            var candidatTbName = _provider.GetTableName(nameof(c_officer_candidat));
            var isFinalizerSql = $"SELECT TOP 1 isFinalizer FROM {candidatTbName}";
            var isFinalizer = _provider.Text<bool>(connection, isFinalizerSql)
                .FirstOrDefault(); //connection.c_officer_candidat.FirstOrDefault(i => i.isFinalizer);
            if (isFinalizer)
            {
                throw new NotImplementedException(VoteStates.StartedRunned.ToString());
            }
            var finalzers =
                _officerCandidatRepository.GetRegistredOfficerCandidatesByTopPvp(connection, MAX_CANDIDATES_COUNT);
            var coSaveHistoryPrName = _provider.GetProcedureName("c_officer_candidat_save_to_history");
            var coDeletePrName = _provider.GetProcedureName("c_officer_candidat_delete_all");
            var resetIndex = _provider.GetProcedureName("help_reset_index");

            var sql = $"EXEC {coSaveHistoryPrName} 1;" +
                      $"EXEC {coDeletePrName};" +
                      $"EXEC {resetIndex} 'c_officer_candidat', 1;";

            _provider.Exec(connection, sql);

            var time = UnixTime.UtcNow();
            var insertFinalizers = finalzers.Select(i => new c_officer_candidat
            {
                dateCreate = time,
                userId = i.UserId,
                voices = 0,
                isFinalizer = true
            }) as IList<c_officer_candidat>;
            var newCandidates = _officerCandidatRepository.AddOrUpdate(connection, insertFinalizers);

            foreach (var newCandidat in newCandidates)
            {
                finalzers.Single(i => i.UserId == newCandidat.userId).Id = newCandidat.Id;
            }
            return finalzers;
        }

        private void _notifyClientsOnVoteStarted(IHubContext<MainGameHub> hubContext = null)
        {
            var newCandidatesOut = _activeCandidates.GetCalculatedOutCandidates();
            var hub = hubContext ?? _hub;
            hub.Clients.All.InvokeAsync("onConfederationVoitingStarted", newCandidatesOut);
        }

        private void _startVoting(IDbConnection connection, IHubContext<MainGameHub> hubContext = null,
            bool notifyClients = true)
        {
            if (!VotingInProgress)
            {
                throw new Exception(Error.IsNotVotePeriod);
            }
            if (_voteSate == VoteStates.StartedRunned)
            {
                throw new Exception(Error.VotingRunnerVoteIsFinishedBefore);
            }
            if (_voteSate == VoteStates.StartInProgress)
            {
                throw new Exception(Error.VotingRunnerStartInProgress);
            }
            List<CandidatOut> finalzers = null;
            try
            {
                _voteSate = VoteStates.StartInProgress;

                finalzers = _startVotingDb(connection);
                _activeCandidates = new ActiveCandidates(finalzers);
                //_notyfyOnVoteEndedComplete
                if (notifyClients)
                {
                    _notifyClientsOnVoteStarted(hubContext);
                }
                _voteSate = VoteStates.StartedRunned;
            }
            catch (Exception e)
            {
                if (e.Message == VoteStates.StartedRunned.ToString())
                {
                    finalzers = _officerCandidatRepository.GetRegistredOfficerCandidatesByTopPvp(connection,
                        MAX_CANDIDATES_COUNT);
                    _activeCandidates = new ActiveCandidates(finalzers);

                    if (notifyClients)
                    {
                        _notifyClientsOnVoteStarted(hubContext);
                    }
                    _voteSate = VoteStates.StartedRunned;
                }
                else
                {
                    _voteSate = VoteStates.StartedErrorInRun;
                    throw;
                }
            }
        }


        private List<IUserOfficerOut> _endVotingDb(IDbConnection connection)
        {
            var existOfficer = _getFirstOfficer(connection);
            var startRegister = StartRegistrationTime;
            var endTime = EndVoteTime;
            if (existOfficer?.dateEnd == endTime)
            {
                throw new NotImplementedException(VoteStates.EndedFinished.ToString());
            }


            var winners = _get_c_vote_get_top_finalized_officers(connection, 4).Select(i => new WinnerCandidat(i))
                .ToList();

            if (winners.Count < 4)
            {
                var existIds = winners.Select(i => i.UserId).ToList();
                var selectCount = 4 - existIds.Count;
                var topCandidates = _officerCandidatRepository.GetRegistredOfficerCandidatesByTopPvp(connection, 0);
                if (!topCandidates.Any())
                {
                    _voteSate = VoteStates.EndedFinished;
                    return null;
                }
                if (topCandidates.Count < 4)
                {
                    throw new NotImplementedException("topCandidates.Count < 4");
                }

                var selectedCandidates = topCandidates.Where(i => !existIds.Contains(i.UserId))
                    .OrderByDescending(i => i.Voices)
                    .ThenBy(i => i.Id)
                    .Take(selectCount)
                    .Select(i => new WinnerCandidat(i))
                    .ToList();

                var newUserIds = selectedCandidates.Select(i => i.UserId).ToList();
                var sqlUserIds = newUserIds.Aggregate("", (current, i) => current + (i + ","));
                sqlUserIds = sqlUserIds.Substring(0, sqlUserIds.Length - 1);

                var userTableName = _provider.GetTableName(nameof(user));
                var allianceUserTableName = _provider.GetTableName(nameof(alliance_user));
                var allianceTableName = _provider.GetTableName(nameof(alliance));


                //Voices = i.count ?? 0;
                //UserAvatar = i.userAvatar;
                //UserId = i.userId;
                //UserName = i.userName;
                //UserPvpPoint = (int)i.userPvpPoint;
                //AllianceId = (int)i.allianceId;
                //AllianceLabel = i.allianceLabel;
                //AllianceName = i.allianceName;
                var sqlAdvancdData = @"SELECT " +
                                     @"u.avatarUrls as userAvatar, " +
                                     @"u.Id as userId, " +
                                     @"u.nickname as userName, " +
                                     @"u.pvpPoint as userPvpPoint, " +
                                     @"a.Id as allianceId, " +
                                     @"a.images as allianceLabel, " +
                                     @"a.name as allianceName " +
                                     $@"FROM {userTableName} AS u " +
                                     $@"LEFT JOIN {allianceUserTableName} AS au ON au.userId=u.Id " +
                                     $@"LEFT JOIN {allianceTableName} AS a ON a.Id=au.allianceId WHERE u.Id IN({sqlUserIds})";
                var advancdData = _provider.Text<dynamic>(connection, sqlAdvancdData).Select(i => new WinnerCandidat(i))
                    .ToList();

                foreach (var adv in advancdData)
                {
                    var item = selectedCandidates.Single(i => i.UserId == adv.UserId);
                    item.AllianceId = adv.AllianceId;
                    item.AllianceName = adv.AllianceName;
                    item.AllianceLabel = adv.AllianceLabel;
                    item.UserAvatar = adv.UserAvatar;
                }
                winners.AddRange(selectedCandidates);
            }
            var execDbo = "EXEC [dbo].";
            var finalizeSql = "BEGIN TRAN end_voting BEGIN TRY " + 
                              $"{execDbo}[c_vote_save_to_history]; " +
                              $"{execDbo}[c_vote_delete_all]; " +
                              $"{execDbo}[help_reset_index] '{nameof(c_vote)}',0; " +
                              $"{execDbo}[c_officer_save_to_history]; " +
                              $"{execDbo}[c_officer_delete_all]; " +
                              $"{execDbo}[help_reset_index] '{nameof(c_officer)}',0; " +
                              $"{execDbo}[c_vote_delete_all]; " +
                              $"{execDbo}[c_officer_candidat_save_to_history] 1; " +
                              $"{execDbo}[c_officer_candidat_delete_all]; " +
                              $"{execDbo}[help_reset_index] '{nameof(c_officer_candidat)}',0; " +
                              "COMMIT TRAN end_voting " +
                              "SELECT 1; " +
                              "END TRY " +
                              "BEGIN CATCH " +
                              "ROLLBACK TRANSACTION end_voting; " +
                              "THROW; " +
                              "END CATCH ";
            var result = _provider.Text<int>(connection, finalizeSql).FirstOrDefault();
            if (result != 1)
            {
                _voteSate = VoteStates.EndedErrorInFinished;
                throw new NotImplementedException(Error.VotingRunnerEndedErrorInFinished);
            }

            if (_weekOfficersStorage != null)
            {
                _weekOfficersStorage.Clear();
                _weekOfficersStorage = null;
            }

            return _buildOfficers(connection, startRegister, winners);
        }

        private List<IUserOfficerOut> _buildOfficers(IDbConnection connection, int startRegister,
            List<WinnerCandidat> winners)
        {
            var officers = new List<IUserOfficerOut>();
            var endOfficerTime = EndVoteTime;
            var insertOfficers = new List<c_officer>
            {
                new c_officer
                {
                    userId = winners[0].UserId,
                    allianceId = winners[0].AllianceId,
                    elected = true,
                    officerType = (byte) OfficerTypes.President,
                    dateStart = startRegister,
                    dateEnd = endOfficerTime
                },
                new c_officer
                {
                    userId = winners[1].UserId,
                    allianceId = winners[1].AllianceId,
                    elected = true,
                    officerType = (byte) OfficerTypes.Atacker,

                    dateStart = startRegister,
                    dateEnd = endOfficerTime
                },
                new c_officer
                {
                    userId = winners[2].UserId,
                    allianceId = winners[2].AllianceId,
                    elected = true,
                    officerType = (byte) OfficerTypes.Protector,
                    dateStart = startRegister,
                    dateEnd = endOfficerTime
                },
                new c_officer
                {
                    userId = winners[3].UserId,
                    allianceId = winners[3].AllianceId,
                    elected = true,
                    officerType = (byte) OfficerTypes.Supporter,
                    dateStart = startRegister,
                    dateEnd = endOfficerTime
                }
            };

            insertOfficers = (List<c_officer>)_officerRepository.AddOrUpdate(connection, insertOfficers);

            var president = insertOfficers.Single(i => i.userId == winners[0].UserId);
            var atacker = insertOfficers.Single(i => i.userId == winners[1].UserId);
            var protector = insertOfficers.Single(i => i.userId == winners[2].UserId);
            var supporter = insertOfficers.Single(i => i.userId == winners[3].UserId);


            var presidentOut = new UserOfficerOut(_officerRepository.ConvertToWorkModel(president));
            presidentOut.UserName = winners[0].UserName;
            presidentOut.UserAvatar = Avatar.GetFileUrls(winners[0].UserAvatar);
            presidentOut.AllianceName = winners[0].AllianceName;
            presidentOut.AllianceLabel = Label.GetFileUrls(winners[0].AllianceLabel);


            var atakerOut = new UserOfficerOut(_officerRepository.ConvertToWorkModel(atacker));
            atakerOut.UserName = winners[1].UserName;
            atakerOut.UserAvatar = Avatar.GetFileUrls(winners[1].UserAvatar);
            atakerOut.AllianceName = winners[1].AllianceName;
            atakerOut.AllianceLabel = Label.GetFileUrls(winners[1].AllianceLabel);

            var defendorOut = new UserOfficerOut(_officerRepository.ConvertToWorkModel(protector));
            defendorOut.UserName = winners[2].UserName;
            defendorOut.UserAvatar = Avatar.GetFileUrls(winners[2].UserAvatar);
            defendorOut.AllianceName = winners[2].AllianceName;
            defendorOut.AllianceLabel = Label.GetFileUrls(winners[2].AllianceLabel);

            var suporterOut = new UserOfficerOut(_officerRepository.ConvertToWorkModel(supporter));
            suporterOut.UserName = winners[0].UserName;
            suporterOut.UserAvatar = Avatar.GetFileUrls(winners[3].UserAvatar);
            suporterOut.AllianceName = winners[3].AllianceName;
            suporterOut.AllianceLabel = Label.GetFileUrls(winners[3].AllianceLabel);

            officers.Add(presidentOut);
            officers.Add(atakerOut);
            officers.Add(defendorOut);
            officers.Add(suporterOut);
            officers.Add(new UserOfficerOut(false, OfficerTypes.Atacker));
            officers.Add(new UserOfficerOut(false, OfficerTypes.Protector));
            officers.Add(new UserOfficerOut(false, OfficerTypes.Supporter));

            return officers;
        }

        private void _notifyClientsOnVotingEnded(IDbConnection connection, IHubContext<MainGameHub> hubContext = null)
        {
            var tabElection = GetTabElection(connection, true);
            var newListIOfficerOut = GetOfficers(connection, true);
            var hub = hubContext ?? _hub;
            hub.Clients.All.InvokeAsync("onConfederationVoitingFinalized", tabElection, newListIOfficerOut);
        }

        private void _endVoting(IDbConnection connection, IHubContext<MainGameHub> hubContext = null,
            bool notifyClients = true)
        {
            if (VotingInProgress)
            {
                throw new Exception(Error.TimeVotingIsNotOver);
            }
            if (_voteSate == VoteStates.EndedFinished)
            {
                throw new Exception(Error.VotingRunnerVoteIsFinishedBefore);
            }
            if (_voteSate == VoteStates.EndInProgress)
            {
                throw new Exception(Error.VotingRunnerEndInProgress);
            }
            try
            {
                _voteSate = VoteStates.EndInProgress;
                _activeCandidates = null;
                List<IUserOfficerOut> officers = _endVotingDb(connection);
   
                if (officers == null || !officers.Any())
                {
                    _voteSate = VoteStates.EndedFinished;
                    return;
                }

                _rebuildWeekOfficers(officers);

                if (notifyClients)
                {
                    _notifyClientsOnVotingEnded(connection, hubContext);
                }
                _voteSate = VoteStates.EndedFinished;
            }
            catch (Exception e)
            {
                if (e.Message == VoteStates.EndedFinished.ToString())
                {
                    if (notifyClients)
                    {
                        _notifyClientsOnVotingEnded(connection, hubContext);
                    }
                    _voteSate = VoteStates.EndedFinished;
                }
                else
                {
                    _voteSate = VoteStates.EndedErrorInFinished;
                    throw;
                }
            }
        }

        private List<CandidatOut> _getFakeCandidates(bool periodIsCheked) => throw new NotImplementedException();

        private class WinnerCandidat
        {
            #region Declare

            public WinnerCandidat()
            {
            }

            /// <summary>
            ///     Set all fields from procedure
            /// </summary>
            /// <param name="i">c_vote_get_top_finalized_officersResult</param>
            public WinnerCandidat(dynamic i)
            {
                Voices = i.count ?? 0;
                UserAvatar = i.userAvatar;
                UserId = i.userId;
                UserName = i.userName;
                UserPvpPoint = (int)i.userPvpPoint;
                AllianceId = (int)i.allianceId;
                AllianceLabel = i.allianceLabel;
                AllianceName = i.allianceName;
            }

            /// <summary>
            ///     need add in out
            ///     UserAvatar;
            ///     AllianceId;
            ///     AllianceLabel;
            ///     AllianceName;
            /// </summary>
            /// <param name="i">CandidatOut</param>
            public WinnerCandidat(CandidatOut i)
            {
                Voices = i.Voices;

                UserId = i.UserId;
                UserName = i.UserName;
                UserPvpPoint = i.PvpPoint;
            }

            #region  Fields

            public int Voices { get; }

            public string UserAvatar { get; set; }
            public int UserId { get; }
            public string UserName { get; }
            public int UserPvpPoint { get; }
            public int AllianceId { get; set; }
            public string AllianceLabel { get; set; }
            public string AllianceName { get; set; }

            #endregion

            #endregion
        }

        private sealed class ActiveCandidates : IDisposableData
        {
            #region Declare

            public ActiveCandidates(List<CandidatOut> resultCandidates)
            {
                if (resultCandidates == null || !resultCandidates.Any())
                {
                    _candidates = new ConcurrentDictionary<int, CandidatOut>();
                }
                else
                {
                    resultCandidates.ForEach(i => i.SetPersent());
                    _totalCount = resultCandidates.Select(i => i.Voices).Sum();
                    _candidates =
                        new ConcurrentDictionary<int, CandidatOut>(
                            resultCandidates.ToDictionary(i => i.UserId, i => i));
                }
            }

            #region  Fields

            /// <summary>
            ///     Кандидаты прошедшие отбор для выборов
            /// </summary>
            private ConcurrentDictionary<int, CandidatOut> _candidates;

            /// <summary>
            ///     Общее количество голосов за вех кандидатов
            /// </summary>
            private int _totalCount;

            public bool IsDisposed { get; private set; }

            #endregion

            #endregion

            #region Interface

            public void Dispose()
            {
                Dispose(true);
                GC.SuppressFinalize(this);
            }

            #endregion


            public bool AddVote(IDbProvider provider, IDbConnection connection, int candidateUserId, int voterUserId)
            {
                provider.ThrowIfConnectionIsNull(connection);
                var hasValue = _candidates.TryGetValue(candidateUserId, out var candidate);
                if (!hasValue)
                {
                    return false;
                }
                var voteTableName = provider.GetTableName(nameof(c_vote));
                var officerCandidatTableName = provider.GetTableName(nameof(c_officer_candidat));
                var sqlAddVote =
                    $"INSERT INTO  {voteTableName}(voterUserId,candidatUserId) VALUES({voterUserId},{candidateUserId}); ";
                if (provider._isExistVote(connection, voterUserId))
                {
                    throw new Exception(Error.UserHasAlreadyCastVote);
                }
                var updateVoce = sqlAddVote +
                                 $"UPDATE {officerCandidatTableName} SET voices=voices+1 WHERE userId = {candidateUserId}";
                provider.Exec(connection, updateVoce);
                candidate.Voices++;
                candidate.SetPersent();
                _totalCount++;
                _candidates.AddOrUpdateSimple(candidate.UserId, candidate);
                return true;
            }

            public List<CandidatOut> GetCalculatedOutCandidates()
            {
                var candidates = _candidates.Select(i => i.Value).ToList();
                var totalCount = _totalCount;
                candidates.ForEach(i =>
                {
                    i.TotalVoices = totalCount;
                    i.SetPersent();
                });
                return candidates;
            }


            private void Dispose(bool disposing)
            {
                if (IsDisposed || !disposing)
                {
                    return;
                }
                IsDisposed = true;
                if (_candidates != null)
                {
                    _candidates.Clear();
                    _candidates = null;
                }
                _totalCount = 0;
            }
        }

        #endregion

        #region Public interface

        public List<CandidatOut> GetCandidates(IDbConnection connection, bool periodIsCheked)
        {
            if (!periodIsCheked)
            {
                _checkAndRunVoteState(connection);
            }
            if (VotingInProgress)
            {
                if (_activeCandidates == null)
                {
                    _fillActiveCandidatesFromDb(connection);
                    if (_activeCandidates == null)
                    {
                        throw new Exception(Error.VotingRunnerStartedNotRunned);
                    }
                }
                var voiceCandidates = _activeCandidates.GetCalculatedOutCandidates();
                if (!voiceCandidates.Any())
                {
                    // никто не зарегестрировался
                    return new List<CandidatOut>();
                    throw new NotImplementedException("!voiceCandidates.Any()");
                }
                return voiceCandidates;
            }
            return _officerCandidatRepository.GetRegistredOfficerCandidatesByTopPvp(connection, MAX_CANDIDATES_COUNT);
        }

        public List<CandidatOut> AddVote(IDbConnection connection, int candidatUserId, int voterUserId)
        {
            if (!VotingInProgress)
            {
                throw new Exception(Error.TimeVotingIsOver);
            }
            if (_activeCandidates == null)
            {
                throw new NotImplementedException("_activeCandidates == null");
            }
            var suc = _activeCandidates.AddVote(_provider, connection, candidatUserId, voterUserId);
            return suc ? _activeCandidates.GetCalculatedOutCandidates() : null;
        }


        /// <summary>
        ///     данные о имени  пвп должны быть назначенны зарание
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="candidat"></param>
        /// <param name="setCcToData"></param>
        /// <returns></returns>
        public List<CandidatOut> RegisterCandidate(IDbConnection connection, CandidatOut candidat,
            Action<int> setCcToData)
        {
            candidat.ValidateRegistrate();
            var ccModel = _storeService.BalanceCalcResultCc(connection, candidat.UserId, REGISTER_CANDIDATE_CC_PRICE);
            List<CandidatOut> candidates = null;
            var hasError = false;
            candidates =
                _officerCandidatRepository.GetRegistredOfficerCandidatesByTopPvp(connection, MAX_CANDIDATES_COUNT);

            var minPvp = candidates.Min(i => i.PvpPoint);
            if (candidates.Count == 0 || candidates.Min(i => i.PvpPoint) < candidat.PvpPoint)
            {
                if (_isExistCandidate(connection, candidat.UserId))
                {
                    throw new Exception(Error.CantRegisterCandidatAlreadyExist);
                }

                _createAndSaveNewCandidate(connection, candidat, false);
                if (candidates.Count == MAX_CANDIDATES_COUNT)
                {
                    var idx = candidates.FindLastIndex(i => i.PvpPoint == minPvp);
                    candidates.RemoveAt(idx);
                }
                candidates.Add(candidat);
            }
            else
            {
                hasError = true;
            }

            if (hasError)
            {
                throw new Exception(Error.CantRegisterCandidatNotEnoughPvP);
            }
            // todo переместить в один коннекшен
            var newBalance = _storeService.AddOrUpdateBalance(connection, ccModel);
            setCcToData(newBalance.Quantity);
            return candidates.OrderByDescending(i => i.PvpPoint).ToList();
        }


        #region dbActions

        private IEnumerable<dynamic> _get_c_vote_get_top_finalized_officers(IDbConnection connection, int takeTopCount)
        {


            var result = _provider.Procedure<dynamic>(connection, "c_vote_get_top_finalized_officers", new
            {
                takeTopCount
            });
            return result;
        }


        private void _createAndSaveNewCandidate(IDbConnection connection, CandidatOut candidat, bool isFinalizer)
        {
            var upd = _officerCandidatRepository.AddOrUpdate(connection, new c_officer_candidat
            {
                dateCreate = UnixTime.UtcNow(),
                userId = candidat.UserId,
                voices = 0,
                isFinalizer = isFinalizer
            });
            candidat.Id = upd.Id;
        }

        private bool _isExistCandidate(IDbConnection connection, int candidateUserId)
        {
            var tableName = _provider.GetTableName(nameof(c_officer_candidat));
            ;
            var sql = $"SELECT TOP 1 Id FROM {tableName} WHERE userId={candidateUserId}";
            return _provider.Text<int>(connection, sql).Any();
        }

        private void _fillActiveCandidatesFromDb(IDbConnection connection)
        {
            var finalzers = _officerCandidatRepository.GetRegistredOfficerCandidatesByTopPvp(connection, 0);
            if (finalzers == null || !finalzers.Any())
            {
                throw new NotImplementedException("finalzers == null || !finalzers.Any()");
            }
            if (finalzers.Count > MAX_CANDIDATES_COUNT)
            {
                finalzers = finalzers.Take(MAX_CANDIDATES_COUNT).ToList();
            }

            _activeCandidates = new ActiveCandidates(finalzers);
        }

        private c_officer _getFirstOfficer(IDbConnection connection)
        {
            var tableName = _provider.GetTableName(nameof(c_officer));
            var sql = $"SELECT TOP 1 * FROM {tableName}";
            return _provider.Text<c_officer>(connection, sql).FirstOrDefault();
        }

        #endregion

        #endregion
    }

    public static class ElectedDbExtension
    {
        public static bool _isExistVote(this IDbProvider provider, IDbConnection connection, int voterUserId)
        {
            provider.ThrowIfConnectionIsNull(connection);
            var tableName = provider.GetTableName(nameof(c_vote));
            var sql = $"SELECT TOP 1 Id FROM {tableName} WHERE voterUserId={voterUserId}";
            return provider.Text<int>(connection, sql).Any();
        }
    }
}