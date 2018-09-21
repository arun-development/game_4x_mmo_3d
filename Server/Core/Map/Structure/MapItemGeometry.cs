using System.ComponentModel.DataAnnotations;
using Server.DataLayer;

namespace Server.Core.Map.Structure
{

    public abstract class MapItemGeometry : IUniqueIdElement
    {


        public int Id { get; set; }
        public virtual byte GameTypeId { get; set; }
        public virtual int TextureTypeId { get; set; }
        [MaxLength(14)]
        public virtual string NativeName { get; set; }
        public virtual byte GalaxyId { get; set; }
        public virtual short SectorId { get; set; }

        /// <summary>
        ///     Возвращает имя типа обекта MapItemGeometry Galaxy,Sector,Star, Planet,Moon
        /// </summary>
        public abstract string MapType();
    }
}
