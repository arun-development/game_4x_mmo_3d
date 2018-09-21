using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security;
using Server.Core.Infrastructure.Alliance;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.Services.OutModel;

namespace Server.Services.UserService
{
    public partial class AllianceService
    {
        public IAllianceUserRequests GetRequestsAllianceForMyAlliance(IDbConnection connection, int senderUserId)
        {
            var result = new AllianceUserRequests(MessageSourceType.IsUser);
            var data = _armCache.LocalOperation(connection,col =>
            {
                return col.Where(i => i.FromId == senderUserId && i.SourceType == MessageSourceType.IsUser
                                      || i.ToId == senderUserId && i.SourceType == MessageSourceType.IsAlliance)
                    .OrderByDescending(i => i.DateCreate)
                    .ToList();
            });
            var allianceGroup = new Dictionary<int, List<AllianceRequestMessageDataModel>>();

            foreach (var request in data)
                if (!allianceGroup.ContainsKey(request.ToId) && request.SourceType == MessageSourceType.IsUser
                    || !allianceGroup.ContainsKey(request.FromId) && request.SourceType == MessageSourceType.IsAlliance)
                    allianceGroup.Add(request.SourceType == MessageSourceType.IsUser ? request.ToId : request.FromId,
                        new List<AllianceRequestMessageDataModel> {request});
                else
                    allianceGroup[request.SourceType == MessageSourceType.IsUser
                        ? request.ToId
                        : request.FromId].Add(request);

            result.Requests = allianceGroup.Select(group =>
            {
                var allianceAccepted = ArmAllianceAcceptedStatus.NoAction;
                if (group.Value.Any(i => i.AllianceAccepted == ArmAllianceAcceptedStatus.Accept))
                    allianceAccepted = ArmAllianceAcceptedStatus.Accept;
                else if (group.Value.Any(i => i.AllianceAccepted == ArmAllianceAcceptedStatus.Reject))
                    allianceAccepted = ArmAllianceAcceptedStatus.Reject;
                var userAccepted = group.Value.Any(i => i.UserAccepted);
                var groupName = group.Value.First(i => i.SourceType == MessageSourceType.IsUser).ToName;

                return new AllianceUserRequestItem
                {
                    GroupName = groupName,
                    GroupId = group.Key,
                    Messages = group.Value.OrderBy(i => i.DateCreate).ToList(),
                    AllianceAccepted = allianceAccepted,
                    UserAccepted = userAccepted
                };
            }).ToList();


            result.SetComplexButtonView();
            return result;
        }

        public bool HasRoleToManageMessage(IDbConnection connection, AllianceUserDataModel currentUser, int outAllianceUserId)
        {
            return currentUser.Id == outAllianceUserId &&
                   AllianceRoleHelper.GetByRoleId(currentUser.RoleId).AcceptNewMembers;
        }


        public IList<AllianceRequestMessageDataModel> UpdateAllianceIconInRequests(IDbConnection connection, int allianceId, string newIcon)
        {
            var items = _armRepo.UpdateAllianceIconInRequests(connection,allianceId, newIcon);
            if (items.Any()) return _armCache.UpdateLocalItems(connection,items.ToList());
            return items;
        }

        public bool DeleteRequestForUserToAlliance(IDbConnection connection, int fromUserId, int toAllianceId)
        {
            var isAllianceRejected= false;
            var armIds = (List<int>)null;
            
            var arms = _armRepo.GetFromToRequestMessages(connection, fromUserId, toAllianceId, (byte)MessageSourceType.IsUser, (byte)MessageSourceType.IsAlliance).ToList();
            armIds = arms.Select(i => i.Id).ToList();
            var allianceRejectStatus = (byte)ArmAllianceAcceptedStatus.Reject;
            isAllianceRejected = arms.Any(i => i.allianceAccepted == allianceRejectStatus);
            var suc = _armRepo.AllianceRequestMessageDeleteUserRequestsAndSaveToHistory(connection, fromUserId, toAllianceId);
            //todo данные в транзакции но что делать с исключением?
            if (!suc) throw new NotImplementedException("DeleteRequestForUserToAlliance Messages not deleted");
            _armCache.DeleteItems(armIds);
            return isAllianceRejected;
        }

        public AllianceRequestMessageDataModel AddArmItem(IDbConnection connection, AllianceRequestMessageDataModel dataModel)
        {
            return _armCache.UpdateLocalItem(connection,_armRepo.AddOrUpdateeModel(connection,dataModel));
        }


        public IList<AllianceUserRequestItem> GetRequestsAllianceForAllianceManage(IDbConnection connection, AllianceUserDataModel allianceUserManager, AllianceRoleDataModel role = null)
        {
            var permition = role ?? AllianceRoleHelper.GetByRoleId(allianceUserManager.RoleId);
            if (!permition.AcceptNewMembers) throw new SecurityException(Error.NotPermitted);

            var data = _armCache.LocalOperation(connection,col =>
            {
                var collection =col.Where(i => i.AllianceAccepted != ArmAllianceAcceptedStatus.Reject &&
                                      (i.FromId == allianceUserManager.AllianceId &&
                                       i.SourceType == MessageSourceType.IsAlliance
                                       || i.ToId == allianceUserManager.AllianceId &&
                                       i.SourceType == MessageSourceType.IsUser))
                    .OrderByDescending(i => i.DateCreate)
                    .ToList();
                return collection;
            });

            var usersGroups = new Dictionary<int, List<AllianceRequestMessageDataModel>>();
            foreach (var request in data)
                if (!usersGroups.ContainsKey(request.ToId) && request.SourceType == MessageSourceType.IsAlliance
                    || !usersGroups.ContainsKey(request.FromId) && request.SourceType == MessageSourceType.IsUser)
                    usersGroups.Add(request.SourceType == MessageSourceType.IsAlliance ? request.ToId : request.FromId,
                        new List<AllianceRequestMessageDataModel> {request});
                else
                    usersGroups[request.SourceType == MessageSourceType.IsAlliance ? request.ToId : request.FromId]
                        .Add(request);
            var result = usersGroups.Select(group =>
            {
                var allianceAccepted = ArmAllianceAcceptedStatus.NoAction;
                if (group.Value.Any(i => i.AllianceAccepted == ArmAllianceAcceptedStatus.Accept))
                    allianceAccepted = ArmAllianceAcceptedStatus.Accept;
                var userAccepted = group.Value.Any(i => i.UserAccepted);
                var groupName = group.Value.First(i => i.SourceType == MessageSourceType.IsUser).FromName;

                return new AllianceUserRequestItem
                {
                    GroupName = groupName,
                    GroupId = group.Key,
                    Messages = group.Value.OrderBy(i => i.DateCreate).ToList(),
                    AllianceAccepted = allianceAccepted,
                    UserAccepted = userAccepted
                };
            }).ToList();

            return result;
        }


        public IList<AllianceRequestMessageDataModel> RejectRequestToAlliance(IDbConnection connection, AllianceUserDataModel currentUser, int rejectUserId, AllianceRoleDataModel role = null)
        {
            var permition = role ?? AllianceRoleHelper.GetByRoleId(currentUser.RoleId);
            if (!permition.AcceptNewMembers) throw new SecurityException(Error.NotPermitted);
            var data = _armCache.LocalOperation(connection,col =>
            {
                return col.Where(i =>
                    i.FromId == currentUser.AllianceId && i.ToId == rejectUserId &&
                    i.SourceType == MessageSourceType.IsAlliance
                    || i.FromId == rejectUserId && i.ToId == currentUser.AllianceId &&
                    i.SourceType == MessageSourceType.IsUser).ToList();
            });
            if (!data.Any()) return data;
            
            foreach (var request in data) request.AllianceAccepted = ArmAllianceAcceptedStatus.Reject;
            var dbData = _armRepo.AddOrUpdateAllModels(connection,data);
            var newData = _armCache.UpdateLocalItems(connection,dbData);
            var alData = newData.FirstOrDefault(i =>i.FromId == currentUser.AllianceId && i.SourceType == MessageSourceType.IsAlliance);
            var rejectedUser = data.First(i => i.FromId == rejectUserId && i.SourceType == MessageSourceType.IsUser);

            var armModel = new AllianceRequestMessageDataModel
            {
                AllianceAccepted = ArmAllianceAcceptedStatus.Reject,
                ToId = rejectUserId,
                DateCreate = UnixTime.UtcNow(),
                FromId = currentUser.AllianceId,
                Message = "Rejected",
                UserAccepted = false,
                SourceType = MessageSourceType.IsAlliance,
                ToName = rejectedUser.FromName
            };
            armModel.AllianceAccepted = ArmAllianceAcceptedStatus.Reject;
            if (alData == null)
            {
                var allaince = GetAllianceById(connection,currentUser.AllianceId, false);
                if (allaince == null) throw new NullReferenceException(Error.AllianceNotExist);
                armModel.FromName = allaince.Name;
                armModel.CreatorIcon = allaince.Images.Icon;
            }
            else
            {
                armModel.FromName = alData.FromName;
                armModel.CreatorIcon = alData.CreatorIcon;
            }
            var messageForUser = AddArmItem(connection,armModel);
            newData.Add(messageForUser);
            return newData;
        }


        public bool DeleteAllianceRequestsByManager(IDbConnection connection, int allianceManagerAllianceId, int targetUserId, bool managerRoleAcceptNewMembers)
        {
            if (!managerRoleAcceptNewMembers) throw new SecurityException(Error.NotPermitted);
            var result = false;
            var allianceId = allianceManagerAllianceId;
            var data = _armRepo.GetFromToRequestMessages(connection, allianceId, targetUserId, (byte)MessageSourceType.IsAlliance, (byte)MessageSourceType.IsUser).ToList();
            if (data.Any())
            {
                result = _armRepo.AllianceRequestMessageDeleteUserRequestsAndSaveToHistory(connection, targetUserId, allianceId);
            }
            var localIds = _armCache.LocalOperation(connection,col =>
            {
                return col.Where(i => i.FromId == allianceId && i.ToId == targetUserId && i.SourceType == MessageSourceType.IsAlliance
                                      || i.FromId == targetUserId && i.ToId == allianceId && i.SourceType == MessageSourceType.IsUser)
                    .Select(i => i.Id).ToList();
            });
            if (localIds != null && localIds.Any()) _armCache.DeleteItems(localIds);
            return result;
        }
    }
}