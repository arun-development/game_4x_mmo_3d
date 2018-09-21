using System.ComponentModel.DataAnnotations;
using Server.Core.Map;
using Server.DataLayer;

namespace Server.Services.OutModel
{
    public class BookmarkOut : IUniqueIdElement
    {
        public const string BookmarkCollectionId = "bookmark-collection";


        public static readonly string Planet = MapTypes.Planet.ToString();
        public static readonly string Star = MapTypes.Star.ToString();
        public static readonly string Sector = MapTypes.Sector.ToString();
        public byte TypeId { get; set; }
        public string TypeName { get; set; }
        public string SubTypeName { get; set; }
        public int ObjectId { get; set; }
        public bool IsFull { get; set; }

        [Required]
        public int Id { get; set; }
    }
}