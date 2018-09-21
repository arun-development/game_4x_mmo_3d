using System.Collections.Generic;
using Server.Core.Interfaces.ForModel;
using Server.Core.СompexPrimitive;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel.JournalOut
{
    public class MotherJumpOut : JournalTask, IMotherJumpOut
    {
        public const short JumpMotherPrice = 5;

        public int EndTime { get; set; }
        public int TargetSystemId { get; set; }
        public int SourceSystemId { get; set; }

        public override void TaskButtons()
        {
            HasButtons = true;
            Buttons = new List<IButtonsView>
            {
                ButtonsView.ConstructorSizeBtn(2, true, "Cancel", "GameServices.journalHelper.cancelMotherJump"),
                ButtonsView.ConstructorSizeBtn(2, true, "InstJump (" + JumpMotherPrice + " sg)",
                    "GameServices.journalHelper.instMotherJump", new {PriceCc = JumpMotherPrice})
            };

            var m = new
            {
                DataTimer = new ItemProgress
                {
                    IsProgress = true,
                    Duration = FlyDuration,
                    StartTime = StartTime
                },
                SourceSystemName,
                TargetSystemName
            };


            SetComplexButtonView(ComplexBtn(m, true));
        }
    }
}