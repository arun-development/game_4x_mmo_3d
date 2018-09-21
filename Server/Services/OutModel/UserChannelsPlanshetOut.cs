using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using Newtonsoft.Json;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.ComplexButton;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Extensions;
using Server.Modules.Localize.Game.UserChannels;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel
{
    public class ChannelGroupRightImageViewData : ImageView {
        public ChannelGroupRightImageViewData() {
            ImagePathOrCss = "fa fa-cogs";
            IsImage = false;
            Title = Server.Modules.Localize.Game.Common.Resource.Settings;
            Alt = Title;
        }
    }


    public class ChannelMessageTransfer : ChannelMessageDataModel, IChannelTypeProperty {
        protected virtual bool _isValid { get; set; }

        public ChannelTypes ChannelType { get; set; }


        public bool MessageValidate(bool withThrow = true) {
            if (Message.Length == 0) {
                if (withThrow) {
                    throw new ArgumentException(Error.IsEmpty, nameof(Message));
                }
                return false;
            }
            if (Message.Length > (int) MaxLenghtConsts.ChannelMessage) {
                if (withThrow) {
                    throw new ArgumentException(Error.OverMaxLength, nameof(Message));
                }
                return false;
            }
            return true;
        }

        public bool IconValidate(bool withThrow = true) {
            if (string.IsNullOrWhiteSpace((UserIcon))) {
                throw new ArgumentException(Error.InputDataIncorrect, nameof(UserIcon));
            }
            return true;
        }

        public bool ChannelIdValidate(bool withThrow = true) {
            if (ChannelId != 0) {
                return true;
            }
            if (withThrow) {
                throw new ArgumentException(Error.InputDataIncorrect, nameof(ChannelId));
            }
            return false;
        }

        public bool ChannelTypeValidate(bool withThrow = true) {
            if (!Enum.IsDefined(typeof(ChannelTypes), ChannelType)) {
                if (withThrow) {
                    throw new ArgumentException(Error.InputDataIncorrect, nameof(ChannelType));
                }
                return false;
            }

            return true;
        }


        protected bool _setNotValid() {
            _isValid = false;
            return false;
        }


        public virtual bool Validate(bool withThrow = true) {
            if (_isValid) {
                return _isValid;
            }
            if (withThrow) {
                MessageValidate();
                IconValidate();
                ChannelIdValidate();
                ChannelTypeValidate();
            }
            else {
                if (!MessageValidate(false)) {
                    return _setNotValid();
                }
                if (!IconValidate(false)) {
                    return _setNotValid();
                }
                if (!ChannelIdValidate(false)) {
                    return _setNotValid();
                }
                if (!ChannelTypeValidate(false)) {
                    return _setNotValid();
                }
            }

            _isValid = true;
            return _isValid;
        }

        public void UpdateByBase(ChannelMessageDataModel baseModel) {
            base.Update(baseModel);
        }
    }

    public class ChannelMessageCreateModel : ChannelMessageTransfer {
        public virtual NameIdInt To { get; set; }

        public bool ToValidate(bool withThrow = true) {
            if (To.Id == 0) {
                if (withThrow) {
                    throw new ArgumentException(Error.InputDataIncorrect, nameof(To.Id));
                }
                return false;
            }
            if (string.IsNullOrWhiteSpace(To.Name)) {
                if (withThrow) {
                    throw new ArgumentException(Error.UserNameNotExsist, nameof(To.Name));
                }
                return false;
            }
            if (To.Name.Length > (int) MaxLenghtConsts.UniqueName) {
                if (withThrow) {
                    throw new ArgumentException(Error.OverMaxLength, nameof(To.Name));
                }
                return false;
            }
            if (To.Name.Length < (int) MinLenghtConsts.GameUserName) {
                if (withThrow) {
                    throw new ArgumentException(Error.LessMin, nameof(To.Name));
                }
                return false;
            }
            if (UserId == To.Id) {
                if (withThrow) {
                    throw new ArgumentException(Error.TargetUserIsYou, nameof(To.Id));
                }
                return false;
            }
            if (UserName == To.Name) {
                if (withThrow) {
                    throw new ArgumentException(Error.TargetUserIsYou, nameof(To.Name));
                }
                return false;
            }
            return true;
        }


        public override bool Validate(bool withThrow = true) {
            if (_isValid) {
                return _isValid;
            }
            if (withThrow) {
                MessageValidate();
                IconValidate();
                ToValidate();
            }
            else {
                if (!MessageValidate(false)) {
                    return _setNotValid();
                }
                if (!IconValidate(false)) {
                    return _setNotValid();
                }
                if (!ToValidate(false)) {
                    return _setNotValid();
                }
            }
            _isValid = true;
            return _isValid;
        }
    }

    public interface IBaseChannelOut : IBaseChannelDataModel, IComplexButtonView {
        int PerPage { get; }
        int ChannelId { get; set; }
        Dictionary<long, ChannelMessageDataModel> Messages { get; set; }
        IButtonsView BtnSendMessage { get; set; }
        void SetBtnSend(bool messageSend);
        void SetMessages(IDbConnection connection, IChannelMessageRepository mesR, int skip = 0);
    }

    public abstract class BaseChannelOut : IBaseChannelOut {
        public const int BASE_PER_PAGE = 50;

        public const int MessageMaxLength = (int) MaxLenghtConsts.ChannelMessage;


        protected BaseChannelOut(ChannelDataModel data) {
            ChannelId = data.Id;
            ChannelType = data.ChannelType;
            ChannelName = data.ChannelName;
            DateCreate = data.DateCreate;
            CreatorId = data.CreatorId;
            CreatorName = data.CreatorName;
            ChannelIcon = data.ChannelIcon;
            PerPage = GetPerPage(ChannelType);
        }

        public bool MessageSend { get; set; }
        public virtual int PerPage { get; }


        public int ChannelId { get; set; }
        public ChannelTypes ChannelType { get; set; }
        public string ChannelName { get; set; }
        public int DateCreate { get; set; }
        public int CreatorId { get; set; }
        public string CreatorName { get; set; }
        public string ChannelIcon { get; set; }
        public ComplexButtonView ComplexButtonView { get; set; }
        public Dictionary<long, ChannelMessageDataModel> Messages { get; set; }
        public IButtonsView BtnSendMessage { get; set; }

        public void SetBtnSend(bool messageSend) {
            MessageSend = messageSend;
            SetBtnSend();
        }


        public virtual void SetMessages(IDbConnection connection, IChannelMessageRepository mesR, int skip = 0)
        {
            var provider = mesR.Provider;
            var msg = provider.GetChannelMessages(connection,ChannelId, skip, PerPage).ToList();
            Messages = !msg.Any()
                ? new Dictionary<long, ChannelMessageDataModel>()
                : msg.Select(mesR.ConvertToWorkModel).ToDictionary(i => i.Id, i => i);
        }


        public abstract void SetComplexButtonView();

        protected abstract void SetBtnSend();

        protected void _setComplexButtonView() {
            ComplexButtonView = new ComplexButtonView();
            var complexButtonSettings = new SectionContentViewData {
                Left = new SectionItem {
                    ItemId = "avatar",
                    IsComplexPart = false,
                    Data = ImageView.Img(ChannelIcon, CreatorName, true, CreatorName)
                },
                Centr = new SectionItem {
                    ItemId = "messages",
                    IsComplexPart = true,
                    Data = new {
                        Head = ChannelName
                    }
                },
                Right = new SectionItem {
                    ItemId = "delete",
                    IsComplexPart = false
                }
            };

            ComplexButtonView.Full(complexButtonSettings);
        }

        protected void _setBtnSend() {
            BtnSendMessage = ButtonsView.ConstructorSizeBtn(4);
            BtnSendMessage.Params = new {
                ChannelId,
                ChannelType,
                MessageMaxLength
            };
            BtnSendMessage.ShowName = true;
            BtnSendMessage.TranslateName = Server.Modules.Localize.Game.Common.Resource.Send;
        }

        /// <summary>
        /// </summary>
        /// <param name="channelType"></param>
        /// <exception cref="ArgumentOutOfRangeException">ChannelType not equal with exists channel groups</exception>
        /// <returns></returns>
        public static int GetPerPage(ChannelTypes channelType) {
            switch (channelType) {
                case ChannelTypes.Private:
                    return PrivateChannelOut.PRIVATE_PER_PAGE;
                case ChannelTypes.Group:
                    return GroupChannelOut.GROUP_PER_PAGE;
                case ChannelTypes.Alliance:
                    return AllianceChannelOut.ALLIANCE_PER_PAGE;
                default:
                    throw new ArgumentOutOfRangeException(nameof(channelType), channelType, Error.NotEquals);
            }
        }
    }

    public class PrivateChannelOut : BaseChannelOut {
        public const int PRIVATE_PER_PAGE = 3; //BASE_PER_PAGE;


        public PrivateChannelOut(ChannelDataModel data) : base(data) { }

        protected override void SetBtnSend() {
            _setBtnSend();
        }

        public override void SetComplexButtonView() {
            base._setComplexButtonView();
            ComplexButtonView.Collection[2].Data =
                ImageView.Img("fa fa-trash-o", Server.Modules.Localize.Game.Common.Resource.Delete);
            ComplexButtonView.Collection[2].JsFunction =
                $"GameServices.userChannelsService.deletePrivateChannel({ChannelId},{(byte) ChannelType},$event)";
        }


        public void SetBtnSend(List<ChannelConnectionDataModel> userChannelConnections, int currentUserId) {
            var connectionData =
                userChannelConnections.First(i => i.UserId == currentUserId && i.ChannelId == ChannelId);
            if (connectionData.MessageSend) {
                SetBtnSend();
            }
        }
    }

    public class GroupChannelOut : BaseChannelOut {
        public const int GROUP_PER_PAGE = BASE_PER_PAGE;
        private readonly ChannelDataModel _data;


        public GroupChannelOut(ChannelDataModel data, int currentUserId) : base(data) {
            _data = data;
            CanManage = data.CreatorId == currentUserId;
            IsPublic = data.Password == "";
        }

        public bool CanManage { get; }
        public bool IsPublic { get; }
        public Dictionary<long, ChannelConnectionUserOut> Users { get; set; }
        public ChannelConnectionUserOut CreatorConnection { get; set; }

        public void SetUsersIfCanMansge(IDbConnection connection, IChannelConnectionRepository repository) {
            if (!CanManage) {
                return;
            }
            var provider = repository.Provider;
            var chTbName = repository.SchemeTableName;//channel_connection
            var userTbName = provider.GetTableName(nameof(user));
            var sql = $"SELECT c.*, u.nickname AS UserName FROM {chTbName} AS c " +
                      $"LEFT JOIN {userTbName} AS u ON c.userId =u.Id "+
                      $"WHERE c.channelId={ChannelId} AND c.channelType={(byte)ChannelType} ";

            Users = provider.Text<dynamic>(connection, sql).Select(i =>
            {
                var d = ((object)i).ToSerealizeString().ToSpecificModel<channel_connection>();
                var r = new ChannelConnectionUserOut(repository.ConvertToWorkModel(d), (string)i.UserName,_data.Password);
                return r;
            }).ToDictionary(i=> i.Id,i=> i);
            CreatorConnection = Users.First(i => i.Value.UserId == _data.CreatorId).Value;
            Users.Remove(CreatorConnection.Id);
        }


        protected override void SetBtnSend() {
            _setBtnSend();
        }

        public override void SetComplexButtonView() {
            base._setComplexButtonView();
            if (CanManage) {
                ComplexButtonView.Collection[2].ItemId = "setting";
                ComplexButtonView.Collection[2].IsComplexPart = CanManage;
                ComplexButtonView.Collection[2].Data = new ChannelGroupRightImageViewData();
            }
            else {
                ComplexButtonView.Collection[2].Data =
                    ImageView.Img("fa fa-trash-o", Server.Modules.Localize.Game.Common.Resource.Delete);
                ComplexButtonView.Collection[2].JsFunction =
                    $"GameServices.userChannelsService.unsubscribeFromGroupChannel({ChannelId},'{ChannelName}',$event)";
            }
        }
    }

    public class AllianceChannelOut : BaseChannelOut {
        public const int ALLIANCE_PER_PAGE = BASE_PER_PAGE;


        public AllianceChannelOut(ChannelDataModel data) : base(data) { }

        protected override void SetBtnSend() {
            _setBtnSend();
        }


        public override void SetComplexButtonView() {
            base._setComplexButtonView();
            ComplexButtonView.Collection[2].ItemId = "empty";
        }
    }


    public class ChannelConnectionUserOut : ChannelConnectionBase, IUserNameProperty {
        public ChannelConnectionUserOut(ChannelConnectionDataModel data, string userName, string channelPassword) :
            base(data) {
            HasCorrectPassword = data.Password == channelPassword;
            UserName = userName;
        }

        public ChannelConnectionUserOut() { }

        public bool HasCorrectPassword { get; set; }
        public string UserName { get; set; }
    }


    public class ChannelTab {
        public ChannelTab(Dictionary<int, IBaseChannelOut> collection) {
            Collection = collection;
        }

        public Dictionary<int, IBaseChannelOut> Collection { get; set; }

        public int MaxChannelsLimit { get; set; }
    }

    public class ChannelsTabsData {
        public ChannelTab Private { get; private set; }
        public ChannelTab Group { get; private set; }
        public ChannelTab Alliance { get; private set; }

        public IPlanshetViewData GetPlanshet() {
            return UserChannelsPlanshetOut.InitialTabs(Private, Group, Alliance);
        }

        public void SetChannelsTabsData(IDbConnection connection, IChannelRepository channelR,IChannelMessageRepository mesR, IChannelConnectionRepository conR, int userId, int allianceId,
            bool allianceRoleMessageSend) {
            var privateCollection = new Dictionary<int, IBaseChannelOut>();
            var groupCollection = new Dictionary<int, IBaseChannelOut>();
            Dictionary<int, IBaseChannelOut> allianceCollection = null;
            var provider = channelR.Provider;
            var channelConnectionTbName = conR.SchemeTableName;
            var channelTableName = channelR.SchemeTableName;
            var ch = ChannelExtensions.SqlAliaceChannel;
            var chCon = ChannelExtensions.SqlAliaceChannelConnection;
            var sqlChannels = $"SELECT {chCon}.messageSend as messageSend, {ch}.* FROM {channelConnectionTbName} AS {chCon} " +
                              $"JOIN {channelTableName} AS {ch} ON {ch}.Id = {chCon}.channelId " +
                              $"WHERE {chCon}.userId={userId} AND {chCon}.messageRead=1 AND {ch}.password={chCon}.password";

            var channelData = provider.Text<dynamic>(connection, sqlChannels);
            var channels = channelData.Select(i =>new {
                    channelData = channelR.ConvertToWorkModel(((object)i).ToSerealizeString().ToSpecificModel<channel>()),
                    messageSend = (bool)i.messageSend
                }
            );

            foreach (var channel in channels)
            {

                switch (channel.channelData.ChannelType)
                {
                    case ChannelTypes.Group:
                        var gChOut = new GroupChannelOut(channel.channelData, userId);
                        gChOut.SetMessages(connection, mesR);
                        gChOut.SetComplexButtonView();
                        gChOut.SetBtnSend(channel.messageSend);
                        gChOut.SetUsersIfCanMansge(connection, conR);
                        groupCollection.Add(gChOut.ChannelId, gChOut);


                        break;
                    case ChannelTypes.Private:
                        var pChOut = new PrivateChannelOut(channel.channelData);
                        pChOut.SetMessages(connection, mesR);
                        pChOut.SetComplexButtonView();
                        pChOut.SetBtnSend(channel.messageSend);

                        privateCollection.Add(pChOut.ChannelId, pChOut);
                        break;
                    case ChannelTypes.Alliance:
                        if (allianceCollection != null)
                        {
                            throw new NotImplementedException("AllianceChannel !=null");
                        }
                        var allianceChannel = new AllianceChannelOut(channel.channelData);
                        allianceChannel.SetMessages(connection, mesR);
                        allianceChannel.SetComplexButtonView();
                        allianceChannel.SetBtnSend(allianceRoleMessageSend);

                        allianceCollection = new Dictionary<int, IBaseChannelOut>(1) {
                                {allianceChannel.ChannelId, allianceChannel}
                            };
                        break;
                    default:
                        throw new NotImplementedException();
                }
            }


            Private = new ChannelTab(privateCollection);
            Group = new ChannelTab(groupCollection) {
                MaxChannelsLimit = (int) MaxLenghtConsts.GroupChannelsLimit
            };
            Alliance = new ChannelTab(allianceCollection);
        }
    }


    public static class UserChannelsPlanshetOut {
        private const string Ext = Directories.Tmpl;
        private const string Prefix = "channel-";
        private const string UserChannelsHtmlDirRoot = Prefix + "root" + Ext;

        //tabs content
        public const string UserChannelsPlanshetId = "user-channels-collection";

        private const string PrivateTmpl = Prefix + "tab-private" + Ext;
        private const string GroupTmpl = Prefix + "tab-group" + Ext;
        private const string AllianceTmpl = Prefix + "tab-alliance" + Ext;

        [MaxLength(3)] public static IReadOnlyList<string> TabIds = new List<string> {
            "user-channels-private",
            "user-channels-group",
            "user-channels-alliance"
        };

        public static string _getTmpl(string name) {
            return Prefix + name + Ext;
        }


        public static IPlanshetViewData InitialTabs(ChannelTab privateData, ChannelTab groupData,
            ChannelTab allianceData) {
            var tabsData = new List<IPlanshetBodyTemplate> {
                new PlanshetBodyTemplate {
                    LastId = 1,
                    TemplateData = privateData,
                    TemplateUrl = PrivateTmpl
                },
                new PlanshetBodyTemplate {
                    LastId = 1,
                    TemplateData = groupData,
                    TemplateUrl = GroupTmpl
                },
                new PlanshetBodyTemplate {
                    LastId = 1,
                    TemplateData = allianceData,
                    TemplateUrl = AllianceTmpl
                }
            };


            var listNames = new List<string> {Resource.Privates,Resource.Groups,Modules.Localize.Game.Alliance.Resource.Alliance
            };


            return PlanshetTabHelper.SetTabData(UserChannelsPlanshetId, Resource.Messages, listNames, tabsData,
                UserChannelsHtmlDirRoot, TabIds);
        }
    }
}