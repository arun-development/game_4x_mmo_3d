using System.ComponentModel.DataAnnotations;
using Server.Core.Images;
using Server.Core.Infrastructure.ComplexButton;

namespace Server.Core.Interfaces.ForModel
{
    public interface IAllianceOut : IPlanshetItem
    {

    }
    public interface IAllianceRatingOut : IAllianceOut, IComplexButtonView
    {
        int PvpPoint { get; set; }
        int ControlledPlanet { get; set; }
        int Pilots { get; set; }
        string AllianceDescription { get; set; }

        byte Tax { get; set; }

        string TaxView { get;  }
        UserImageModel Label { get; set; }

        [MaxLength(14)]
        string LeaderName { get; set; }

        UserImageModel LeaderImg { get; set; }
        SectionContentViewData SerchSections();
        SectionContentViewData MyAllianceSection();
        void AddButtons(int userAllianceId, byte tabIdx);

        int GetAllianceCc();
    }

}