using System;
using System.ComponentModel.DataAnnotations;
using Server.Core.Infrastructure;
using Server.Core.СompexPrimitive.Resources;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel.JournalOut {
    public abstract class Reports : JournalOut {
        public const string ReportCenterTaskTmpl = Prefix + "paralax-centr" + Ext;
        public const string ReportInfoTmpl = Prefix + "report-info" + Ext;
        public int TargetPlanetId { get; set; }

        [MaxLength(14)]
        public string TargetUserName { get; set; }

        public int TotalItems { get; set; }
        public string Date { get; set; }
        public string TimeNow { get; set; }
        public bool IsLose { get; set; }
        public bool IsReport { get; set; }
        public MaterialResource TargetResource { get; set; }

        protected void ReportInfoBtns() {
            var isNpc = (string.Equals(TargetUserName, Npc.SkagyName, StringComparison.CurrentCultureIgnoreCase));
            var fromReport = IsReport;
            var btnPref = (fromReport) ? "report_" + Id + "_" : "spy_" + Id + "_";

            if (!isNpc) {
                var mes = ButtonsView.ConstructorSizeBtn(2, true, "tr_send message");
                mes.ButtonId = btnPref + "mes";

                Buttons.Add(mes);
                var smSpay = ButtonsView.Spy(2, TargetPlanetId, TargetPlanetName, true);
                smSpay.ButtonId = btnPref + "spy";
                Buttons.Add(smSpay);
            }
            else {
                if (IsLose  || !fromReport) {
                    var spyBtn = ButtonsView.Spy(1, TargetPlanetId, TargetPlanetName, true);
                    spyBtn.ButtonId = btnPref + "spy";
                    Buttons.Add(spyBtn);
                }
            }
        }
    }
}