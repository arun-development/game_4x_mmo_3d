using Server.Core.Infrastructure.ComplexButton;

namespace Server.Core.Interfaces.ForModel
{
    public interface IJournalOut : IPlanshetItem, IComplexButtonView
    {
 
        string SourceOwnName { get; set; }


        string SourceSystemName { get; set; }

        /// <summary>
        ///     false -mother, true -planet
        /// </summary>
        bool SourceOwnType { get; set; }


        string TargetPlanetName { get; set; }

        string TargetSystemName { get; set; }

        ImageView LeftImage { get; set; }
        ImageView RightImage { get; set; }
    }

    public interface IJournalTask : IJournalOut
    {
        int FlyDuration { get; set; }
        int StartTime { get; set; }
        void TaskButtons();
    }


}