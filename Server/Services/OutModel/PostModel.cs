using Server.Core.Interfaces;
using Server.DataLayer;

namespace Server.Services.OutModel
{
    public class PostSimpleModel : IUniqueIdElement, INativeName
    {
        public string NativeName { get; set; }
        public int Id { get; set; }
    }
}