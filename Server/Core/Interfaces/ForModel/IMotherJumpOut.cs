namespace Server.Core.Interfaces.ForModel
{
    public interface IMotherJumpOut : IJournalTask
    {
        int EndTime { get; set; }
        int TargetSystemId { get; set; }
        int SourceSystemId { get; set; }
    }
}