using System.ComponentModel.DataAnnotations;
using System.Data;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive;

namespace Server.Core.Map
{
    public interface IMapAdress : ITest
    {
        #region Sync
        MapAdress GetAdress(IDbConnection connection, string name);
        MapAdress GetAdress(IDbConnection connection, int id);

        #endregion

    }

    public class EstateAdress
    {
        public int System;
        public short Sector;
        public byte Galaxy;
        public int OwnId;
    }

    public class MapAdress : EstateAdress
    {
        public Vector3 GalaxyPosition;
        public Vector3 SectorPosition;
        public Vector3 SystemPosition;
        public Vector3 PlanetPosition;
    }

    public class EstateItemOut : EstateAdress
    {
        public const string ViewKey = "EstateListDataKey";

        [MaxLength(14)]
        public string Name;

        /// <summary>
        ///     <value> false - mazer, true - Planet</value>
        /// </summary>
        public bool Type;

        public int TextureTypeId;
        public int GameTypeId;
    }
}