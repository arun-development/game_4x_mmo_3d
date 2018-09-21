using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Server.Core.Interfaces.Confederation;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Services.HtmlHelpers;

namespace Server.Services.Confederation
{
    public class TabOfficer
    {
        public TabOfficer()
        {
        }

        public TabOfficer(IEnumerable<IOfficerOut> data)
        {
            if (data == null) return;
            Officers = data.OrderBy(i => (byte) i.Type).ToList();
        }

        public List<IOfficerOut> Officers { get; set; }
    }

    public class TabUserRating
    {
        public const int PER_PAGE = 25;
        public int PerPage = PER_PAGE;

        public TabUserRating()
        {
        }

        public TabUserRating(IList<UserDataModel> users, int skip)
        {
            if (users == null || !users.Any())
            {
                Users = new List<UserRattingItem>();
                return;
            }
            Users = CreateUserList(users, skip);
        }

        public List<UserRattingItem> Users { get; }

        public static List<UserRattingItem> CreateUserList(IList<UserDataModel> users, int skip)
        {
            var userList = new List<UserRattingItem>();
            var top = skip + 1;
            foreach (var user in users)
            {
                userList.Add(new UserRattingItem(user, top));
                top++;
            }
            return userList;
        }
    }

    public class TabElection
    {
        public TabElection(bool isRegisterPeriod, List<CandidatOut> candidates, int registrCcPrice)
        {
            IsRegisterPeriod = isRegisterPeriod;
            Candidates = candidates;
            RegistrCcPrice = registrCcPrice;
        }

        public bool IsRegisterPeriod { get; }

        [MaxLength((int) MaxLenghtConsts.MaxOfficerCandidates)]
        public List<CandidatOut> Candidates { get; set; }

        public int RegistrCcPrice { get; }
        public int StartRegistrationTime { get; private set; }
        public int StartVoteTime { get; private set; }
        public int EndVoteTime { get; private set; }


        /// <summary>
        ///     for client model
        /// </summary>
        public bool Registred { get; }

        /// <summary>
        ///     for client model
        /// </summary>
        public IButtonsView RegistrBtn { get; }

        public void SetTimes(int startRegistrationTime, int startVoteTime, int endVoteTime)
        {
            StartRegistrationTime = startRegistrationTime;
            StartVoteTime = startVoteTime;
            EndVoteTime = endVoteTime;
        }
    }

    public static class ConfederationPlanshetOut
    {
        public const string Prefix = "confederation-";
        public const string Ext = Directories.Tmpl;

        private const string ConfederationRootTmpl = Prefix + "planshet-root" + Ext;


        //tabs content
        public const string ConfederationPlanshetId = "confederation-collection";

        private const string OfficersTmpl = Prefix + "tab-officers" + Ext;
        private const string RatingTmpl = Prefix + "tab-rating" + Ext;
        private const string ElectionTmpl = Prefix + "tab-election" + Ext;

        [MaxLength(3)] public static List<string> TabIds = new List<string>
        {
            "confederation-officers",
            "confederation-rating",
            "confederation-voting"
        };


        public static IPlanshetViewData InitialTabs(object officersData, object ratingData, object votingData,
            ILocalizerService localizer)
        {
            var confederationTranslates = localizer.GetGameTranstaleGroup(GameTranslateType.confederation);

            var tabsData = new List<IPlanshetBodyTemplate>
            {
                new PlanshetBodyTemplate
                {
                    TemplateData = officersData,
                    TemplateUrl = OfficersTmpl
                },
                new PlanshetBodyTemplate
                {
                    TemplateData = ratingData,
                    TemplateUrl = RatingTmpl
                },
                new PlanshetBodyTemplate
                {
                    TemplateData = votingData,
                    TemplateUrl = ElectionTmpl
                }
            };


            var listNames = new List<string>
            {
                confederationTranslates["officers"],
                confederationTranslates["rating"],
                confederationTranslates["election"]
            };


            return PlanshetTabHelper.SetTabData(ConfederationPlanshetId, confederationTranslates["confederation"],
                listNames, tabsData, ConfederationRootTmpl, TabIds);
        }
    }
}