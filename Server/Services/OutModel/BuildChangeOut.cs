using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Resources;

namespace Server.Services.OutModel
{
    public abstract class BuildChangeOut
    {
        public int OwnId { get; set; }
        public int UserId { get; set; }
    }

    public class EnergyConverterChangeOut : BuildChangeOut
    {
        public string From { get; set; }
        public string To { get; set; }
        public int ToConvert { get; set; }
    }

    public class ExtractionModuleChangeOut : BuildChangeOut
    {
        public MaterialResource Proportion { get; set; }
    }

    public class StorageModuleChangeOut : BuildChangeOut
    {
        public MaterialResource Proportion { get; set; }
    }

    public class TransferResource
    {
        public MaterialResource Resources { get; set; }
        public int SourceId { get; set; }
        public bool SourceType { get; set; }
        public int TargetId { get; set; }
        public bool TargetType { get; set; }
    }

    public class UnitTurnOut : BuildChangeOut, INativeName
    {
        public int Count { get; set; }
        public bool ForCc { get; set; }

        public string NativeName { get; set; }
    }
}