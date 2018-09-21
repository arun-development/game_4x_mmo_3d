using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using MoreLinq;
using Server.Core.Images;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Infrastructure.ComplexButton;
using Server.Core.Interfaces.ForModel;
using Server.Core.Npc;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel
{
    public class AllianceOut : IPlanshetItem
    {

        private const string Ext = Directories.Tmpl;
        private const string Prefix = "alliance-";
        private const string AllianceTabsRootTmpl = Prefix + "planshet-root" + Ext;
        public const string AllianceNamesKey = "AllianceNamesKey";

        //tabs content
        public const string AlliancePlanshetId = "alliance-collection";

        protected const string SerchTmpl = Prefix + "tab-serch" + Ext;
        protected const string ManageTmpl = Prefix + "tab-manage" + Ext;
        protected const string MyAllianceTmpl = Prefix + "tab-my-alliance" + Ext;


        //tabs other
        protected const string RatingCentrTmpl = Prefix + "rating-centr" + Ext;


        [MaxLength(3)]
        public static List<string> TabIds = new List<string>
        {
            "alliance-serch",
            "alliance-my",
            "alliance-manage"
        };
        [MaxLength(14)]
        public string Name { get; set; }

        public int Id { get; set; }
        public List<IButtonsView> Buttons { get; set; }
        public bool HasButtons { get; set; }


        public static PlanshetViewData InitialTabs(object initialData, object myAllianceData, object manageAllianceData, ILocalizerService localizer)
        {

            var allianceTranslates = localizer.GetGameTranstaleGroup(GameTranslateType.alliance);


            var tabsData = new List<IPlanshetBodyTemplate>
            {
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = initialData,
                    TemplateUrl = SerchTmpl
                },
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = myAllianceData,
                    TemplateUrl = MyAllianceTmpl
                },
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = manageAllianceData,
                    TemplateUrl = ManageTmpl
                }
            };


            var listNames = new List<string>
            {
                allianceTranslates["serch"],
                allianceTranslates["myAlliance"],
                allianceTranslates["manageAlliance"]
            };

            return PlanshetTabHelper.SetTabData(AlliancePlanshetId, allianceTranslates["alliance"], listNames, tabsData, AllianceTabsRootTmpl, TabIds);
        }
    }

    public class AllianceRatingOut : AllianceOut, IAllianceRatingOut
    {
        private AllianceDataModel _dbAlliance { get; }

        public AllianceRatingOut(AllianceDataModel dbAlliance)
        {
            _dbAlliance = dbAlliance;
            Id = _dbAlliance.Id;
            Tax = _dbAlliance.Tax;
            Name = _dbAlliance.Name;
            AllianceDescription = _dbAlliance.Description;
            Label = _dbAlliance.Images;
            PvpPoint = _dbAlliance.PvpRating;
            LeaderName = _dbAlliance.CreatorName;
        }

        public AllianceRatingOut(AllianceRatingOut other)
        {
            _dbAlliance = other._dbAlliance;
            Name = other.Name;
            Id = other.Id;
            Buttons = other.Buttons;
            HasButtons = other.HasButtons;

            PvpPoint = other.PvpPoint;
            ControlledPlanet = other.ControlledPlanet;
            Pilots = other.Pilots;
            AllianceDescription = other.AllianceDescription;
            Tax = other.Tax;
            Label = other.Label;
            LeaderName = other.LeaderName;
            LeaderImg = other.LeaderImg;
            ComplexButtonView = other.ComplexButtonView;


        }

        private byte _tax;
        private static int ConfederationAlliId => (int)NpcAllianceId.Confederation;
        public int PvpPoint { get; set; }
        public int ControlledPlanet { get; set; }
        public int Pilots { get; set; }
        public string AllianceDescription { get; set; }

        public byte Tax
        {
            get { return _tax; }
            set
            {
                _tax = value;
                TaxView = value + "%";
            }
        }

        public string TaxView { get; private set; }
        public UserImageModel Label { get; set; }

        [MaxLength(14)]
        public string LeaderName { get; set; }

        public UserImageModel LeaderImg { get; set; }

        public ComplexButtonView ComplexButtonView { get; set; }


        public void SetComplexButtonView()
        {
            var cb = new ComplexButtonView();
            cb.Full(SerchSections());
            ComplexButtonView = cb;
        }


        public SectionContentViewData SerchSections()
        {
            return new SectionContentViewData
            {
                Left = new SectionItem
                {
                    Data = ImageView.Img(Label.Icon, Name, true),

                    IsPath = true
                },
                Centr = new SectionItem
                {
                    Data = new AllianceSerchCentrDataView(Name, PvpPoint, Pilots, ControlledPlanet),
                    Path = RatingCentrTmpl
                },
                Right = new SectionItem
                {
                    Data = ImageView.Img(LeaderImg.Icon, LeaderName, true),

                    IsPath = true
                }
            };
        }

        public SectionContentViewData MyAllianceSection()
        {
            return new SectionContentViewData
            {
                Left = new SectionItem
                {
                    Data = ImageView.Img(Label.Icon, Name, true),

                    IsPath = true
                },
                Centr = new SectionItem
                {
                    Data = new AllianceSerchCentrDataView(Name, PvpPoint, Pilots, ControlledPlanet),
                    Path = RatingCentrTmpl
                },
                Right = new SectionItem
                {
                    Data = ImageView.Img(LeaderImg.Icon, LeaderName, true),
                    IsPath = true

                }
            };
        }

        public void AddButtons(int userAllianceId, byte tabIdx)
        {


            switch (tabIdx)
            {
                case 0:
                    if (Id == userAllianceId || userAllianceId == (int)NpcAllianceId.Confederation)
                    {
                        CheckButtons();
                        AddSerchButtons(userAllianceId);
                    }
                    break;
                case 1:
                    CheckButtons();
                    AddUserAllianceButtons();
                    break;
            }
        }

        public int GetAllianceCc()
        {
            return _dbAlliance.Cc;
        }


        private void CheckButtons()
        {
            if (HasButtons) return;
            Buttons = new List<IButtonsView>();
            HasButtons = true;
        }

        private void AddButton(IButtonsView btn)
        {
            var exist = Buttons.Find(i => i.ButtonId == btn.ButtonId);
            if (exist == null) Buttons.Add(btn);
        }

        private void AddSerchButtons(int userAllianceId)
        {
            if (Id == ConfederationAlliId) return;
            AddButton(userAllianceId == Id ? ButtonsView.LeaveFromAlliance(Id) : ButtonsView.JoinToAlliacne(Id, Name));
        }

        private void AddUserAllianceButtons()
        {
            if (Id != ConfederationAlliId) AddButton(ButtonsView.LeaveFromAlliance(Id));
        }
    }

    public class TabAllianceSerchOut
    {
        public IList<IAllianceRatingOut> Collection { get; set; }

        public void AddAlianceButtons(int userAllianceId)
        {
            foreach (var a in Collection)
            {
                a.AddButtons(userAllianceId, 0);
            }
        }
    }

    public class TabMyAllianceOut : AllianceRatingOut, IAllianceUserRequestInst
    {
        public AllianceMembers AllianceMembers { get; set; }
        public IAllianceUserRequests AllianceUserRequests { get; set; }
        public AllianceTechesOut AllianceTechesOut { get; set; }
        public int BalanceCc { get; }

        public void AddAlianceButtons()
        {
            AddButtons(Id, 1);
        }

        public TabMyAllianceOut(AllianceRatingOut baseItem) : base(baseItem)
        {
            BalanceCc = baseItem.GetAllianceCc();
        }

    }

    public class TabAllianceManageOut : IAllianceUserRequestInst
    {
        public IAllianceUserRequests AllianceUserRequests { get; set; }
        private bool _canDeleteAlliance = false;
        public bool CanDeleteAlliance
        {
            get { return _canDeleteAlliance; }
            set
            {
                _canDeleteAlliance = value;
                if (value)
                {
                    DisbandAllianceBtn = ButtonsView.ConstructorSizeBtn(1, true, "delete alliance", "GameServices.allianceService.disbandAlliance");
                }
            }
        }
        public IButtonsView DisbandAllianceBtn { get; private set; }

    }

    public class AllianceRole : AllianceRoleDataModel
    {
        public AllianceRole()
        {
        }

        public AllianceRole(byte roleId)
        {
            SetRole(AllianceRoleHelper.GetByRoleId(roleId));
        }


        public void SetRole(AllianceRoleDataModel repoRole)
        {
            Id = repoRole.Id;
            RoleName = repoRole.RoleName;
            EditAllianceInfo = repoRole.EditAllianceInfo;
            MessageRead = repoRole.MessageRead;
            MessageSend = repoRole.MessageSend;
            ShowManage = repoRole.ShowManage;
            SetTech = repoRole.SetTech;
            CanManagePermition = repoRole.CanManagePermition;
            AcceptNewMembers = repoRole.AcceptNewMembers;
            DeleteMembers = repoRole.DeleteMembers;
        }

        public void SetRole(string roleName)
        {
            SetRole(AllianceRoleHelper.GetByRoleName(roleName));
        }
    }

    public class AllianceMember
    {
        public int AllianceUserId { get; set; }
        public int UserId { get; set; }

        [MaxLength(14)]
        public string UserName { get; set; }

        public int UserPvp { get; set; }
        public bool OnlineStatus { get; set; }
        public AllianceRole Role { get; set; }
    }


    public class AllianceMembers : IComplexButtonView
    {
        public Dictionary<string, L10NSimple> TranslateRoleNames = AllianceRoleHelper.RoleNames.ToDictionary(i => i.Key, i => i.Value);

        public List<AllianceMember> Members { get; set; }
        public string CurrentUserRoleName { get; set; }

        public Dictionary<string, L10NSimple> TranslateRoleFields { get; } = AllianceRoleHelper.RoleFields.ToDictionary(i => i.Key, i => i.Value);

        public Dictionary<byte, AllianceRole> Roles { get; } = AllianceRoleHelper.Roles.ToDictionary(i => i.Key,
            i =>
            {
                var role = new AllianceRole();
                role.SetRole(i.Value);
                return role;
            });

        public ComplexButtonView ComplexButtonView { get; set; }

        public void SetComplexButtonView()
        {
            //var data = new SectionContentViewData {Centr = ""};
            //var cb = new ComplexButtonView();
            //cb.Full(data);
            ComplexButtonView = new ComplexButtonView().SimpleCentr(null, "Alliance members");
        }
    }

    public class AllianceRoleUpdateOut
    {
        public int AllianceId { get; set; }
        public int UserId { get; set; }
        public byte RoleId { get; set; }
    }

    public class AllianceUserRequests : IAllianceUserRequests
    {

        private readonly string _cbName;
        public AllianceUserRequests(MessageSourceType msType)
        {
            if (msType == MessageSourceType.IsUser) _cbName = "My Requests to alliacne";
            else if (msType == MessageSourceType.IsAlliance) _cbName = "Requests to alliacne";


        }

        public IList<AllianceUserRequestItem> Requests { get; set; }
        public int LastUpdateTime => 0;
        public ComplexButtonView ComplexButtonView { get; set; }

        public void SetComplexButtonView()
        {
            ComplexButtonView = new ComplexButtonView().SimpleCentr(null, _cbName);
        }
    }


    public class AllianceTechesOut : IComplexButtonView
    {
        public ComplexButtonView ComplexButtonView { get; set; }
        public Dictionary<TechType, TechOut> Teches { get; set; }
        public bool CanUpgrade { get; set; }

        public void SetComplexButtonView()
        {
            ComplexButtonView = new ComplexButtonView().SimpleCentr(null, "Alliance laboratory");
        }

        public AllianceTechesOut()
        {
        }
        public AllianceTechesOut(AllianceRoleDataModel userRole, Dictionary<TechType, ItemProgress> dbAllianceTeches)
        {
            CanUpgrade = userRole.SetTech;
            var techService = new BattleTeches(dbAllianceTeches);
            var teches = techService.GetTeches(false);
 
            teches.ForEach(i =>
            {
                i.Value.Progress.Advanced = i.Value.GetPropertiesView(true);
            });
            Teches = techService.ConvertToTechesOut(true);
            Teches.ForEach(i =>
            {
                i.Value.CalcResultPrice(false);
            });

            SetComplexButtonView();


        }
    }
}