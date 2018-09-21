using Server.Core.Interfaces.ForModel;

namespace Server.Services.OutModel.JournalOut
{
    public abstract class JournalTask : JournalOut, IJournalTask
    {
        public int FlyDuration { get; set; }
        public int StartTime { get; set; }

        public abstract void TaskButtons();
    }
}