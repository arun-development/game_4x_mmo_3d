using System.Collections.Generic;
using Server.Core.Interfaces.ForModel;
using Server.Core.СompexPrimitive.Units;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel.JournalOut
{
    public class TabSpyOut : Reports
    {
        public const int MAX_ITEMS = 10;
        public Dictionary<UnitType, HangarUnitsOut> TargetHangar = HangarUnitsOut.EmptyHangar();
        public IList<TabSpyOut> Collection { get; set; }

        public TabSpyOut()
        {
            IsReport = false;
        }

        private void InitComplexButton()
        {
            var m = new
            {
                TargetPlanetName,
                TargetSystemName,
                Date,
                TimeNow
            };

            var cb = ComplexBtn(m, false, RightImage.IsImage);
            
            //cb.Left.JsFunction = "(function(){  console.log('Hi left'); return false;  })()";
            //cb.Right.JsFunction = "console.log('Hi right')";
 
            SetComplexButtonView(cb);
        }

        private void SpyButtons()
        {
            HasButtons = true;
            var atkBtn = ButtonsView.Attack(true, 2, TargetPlanetName, TargetPlanetId);
            atkBtn.ButtonId = "spy_" + Id + "_attack";
            Buttons = new List<IButtonsView>
            {
                atkBtn,
                ButtonsView.SpyDelete(Id)
            };
            ReportInfoBtns();
        }

        public static void InitComplexBtnCollection(IList<TabSpyOut> col)
        {
            foreach (var i in col)
            {
                InitComplexBtnItem(i);
            }
        }

        public static void InitComplexBtnItem(TabSpyOut item)
        {
 
            item.SpyButtons();
            item.InitComplexButton();
        }
    }
}