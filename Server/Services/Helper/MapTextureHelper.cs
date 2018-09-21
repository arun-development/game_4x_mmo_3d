using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Server.DataLayer.Repositories;

namespace Server.Services.Helper
{
    public class MapTextureHelper
    {
        private static readonly Random Rand = new Random();

        public List<int> GetTextureListByType(IDbConnection connection, IGTextureTypeRepository textureTypeRepository, int textureTypeId)
        {
            return textureTypeRepository
                .GetByGameTypeId(connection, textureTypeId)
                .Select(texture => (int)texture.Id)
                .ToList();

        }


        public int GetRandomTexture(int typeId, List<int> texturesByType, ref Dictionary<int, List<int>> texturesUsed)
        {
            if (!texturesUsed.ContainsKey(typeId)) texturesUsed.Add(typeId, new List<int>());

            if (texturesByType.Count <= texturesUsed[typeId].Count) texturesUsed[typeId].Clear();
            var textureIndex = Rand.Next(0, texturesByType.Count);

            while (texturesUsed[typeId].Contains(textureIndex))
                textureIndex = Rand.Next(0, texturesByType.Count);

            var textureId = texturesByType[textureIndex];

            texturesUsed[typeId].Add(textureIndex);

            return textureId;
        }
    }
}