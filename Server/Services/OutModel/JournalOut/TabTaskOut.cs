using System.Collections.Generic;
using Server.Core.Interfaces.ForModel;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Units;
using Server.Modules.Localize.Game.Journal;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel.JournalOut {
    public class TabTaskOut : JournalTask {
        public const string TaskCenterPartialPath = Prefix + "task-centr" + Ext;
        public const int MAX_ITEMS = 30;

        private Dictionary<UnitType, HangarUnitsOut> _hangarInTask;

        //[NonSerialized]
        public IList<TabTaskOut> Collection;


        public Dictionary<UnitType, HangarUnitsOut> HangarInTask {
            get { return _hangarInTask ?? (_hangarInTask = HangarUnitsOut.EmptyHangar()); }
            set { _hangarInTask = value; }
        } // = HangarUnitsOut.EmptyHangar();

        public IMotherJumpOut MotherJump { get; set; }
        public bool IsAtack { get; set; }
        public bool IsTransfer { get; set; }

        public override void TaskButtons() {
            HasButtons = true;
            Buttons = new List<IButtonsView> {
                ButtonsView.NewTaskAttack(),
                ButtonsView.NewTaskTransfer(),
                ButtonsView.ConstructorSizeBtn(3, true, Resource.Reset, "GameServices.journalHelper.resetTaskUnits"),
                ButtonsView.ConstructorSizeBtn(3, true, Resource.LoadAll, "GameServices.journalHelper.setAllUnits"),
                ButtonsView.ConstructorSizeBtn(3, true, null, "GameServices.journalHelper.submitTaskForm")
            };
        }


        private void InitComplexButton() {
            var m = new {
                DataTimer = new ItemProgress {
                    IsProgress = true,
                    Duration = FlyDuration,
                    StartTime = StartTime
                },
                SourceOwnName,
                SourceSystemName,
                TargetPlanetName,
                TargetSystemName
            };


            SetComplexButtonView(ComplexBtn(m, true));
        }

        private void DropButtons() {
            HasButtons = true;
            Buttons = new List<IButtonsView> {
                ButtonsView.ConstructorSizeBtn(2, true, Resource.Jump),
                ButtonsView.ConstructorSizeBtn(2, true, Resource.ReturnFleet)
            };
        }

        public static void InitComplexBtnCollection(IList<TabTaskOut> col) {
            foreach (var i in col) {
                InitComplexBtnItem(i);
            }
        }

        public static void InitComplexBtnItem(TabTaskOut item) {
            item.DropButtons();
            item.InitComplexButton();
        }
    }
}