using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Server.Core.Interfaces.ForModel;
using Server.Core.Map;
using Server.Core.СompexPrimitive.Units;
using Server.Modules.Localize.Game.Journal;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel.JournalOut
{
    public class TabReportOut : Reports
    {
 
        public IList<TabReportOut> Collection { get; set; }
        public bool AtackerIsSkagry { get; set; }
        public bool CurrentUserIsAtacker { get; set; }

        public string AtackerCss { get; set; }
        public string DefendorCss { get; set; }

        public TabReportOut()
        {
            IsReport = true;
        }

        [MaxLength(14)]
        public string SourceUserName { get; set; }

        public Dictionary<UnitType, ReportFleetOut> SourceReportHangar { get; set; }
        public Dictionary<UnitType, ReportFleetOut> TargetReportHangar { get; set; }
        public EstateItemOut EstateItem { get; set; }

        private void SetSideCss()
        {
            const string currentUser = "side-current-user";
            const string targetUser = "side-enemy";

            if (CurrentUserIsAtacker)
            {
                AtackerCss = currentUser;
                DefendorCss = targetUser;
            }
            else
            {
                AtackerCss = targetUser;
                DefendorCss = currentUser;
            }
        }

        private void InitComplexButton()
        {

            var m = new
            {
                TargetPlanetName,
                TargetSystemName,
                CenterMessage =   IsLose ? Resource.Lose : Resource.Win,
                Date,
                TimeNow
            };
            SetComplexButtonView(ComplexBtn(m));
        }

        private void DropButtons()
        {
            HasButtons = true;
            Buttons = new List<IButtonsView>
            {
                ButtonsView.ReportDelete(Id)
            };
            ReportInfoBtns();
        }


        public static void InitComplexBtnCollection(IList<TabReportOut> col)
        {
            foreach (var i in col)
            {
                InitComplexBtnItem(i);
            }
        }

        public static void InitComplexBtnItem(TabReportOut item)
        {
            item.DropButtons();
            item.SetSideCss();
            item.InitComplexButton();
        }
    }
}