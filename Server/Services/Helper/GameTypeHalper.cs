using System;
using System.Collections.Generic;
using System.Linq;

namespace Server.Services.Helper
{
    public static class GameTypeHalper
    {

        public static byte GetRandomTypeFromUsedTyps(List<byte> typeList, ref List<byte> typeUsed)
        {
            if (typeList.Count == 1)
            {
                if (!typeUsed.Any()) typeUsed.Add(typeList[0]);
                return typeList[0];
            }
            var rand = new Random();
            if (typeList.Count <= typeUsed.Count) typeUsed.Clear();

            var idx = rand.Next(0, typeList.Count);

            while (typeUsed.Contains((byte) idx))
            {
                idx = rand.Next(0, typeList.Count);
            }

            var textureId = typeList[idx];

            typeUsed.Add((byte) idx);

            return textureId;
        }




        public static short GetRandomTypeFromUsedTyps(List<short> typeList, ref List<short> typeUsed)
        {
            if (typeList.Count == 1)
            {
                if (!typeUsed.Any()) typeUsed.Add(typeList[0]);
                return typeList[0];
            }

            var rand = new Random();
     

            if (typeList.Count <= typeUsed.Count) typeUsed.Clear();
            var idx = rand.Next(0, typeList.Count);

            while (typeUsed.Contains((short) idx))
            {
                idx = rand.Next(0, typeList.Count);
            }

            var textureId = typeList[idx];

            typeUsed.Add((short) idx);

            return textureId;
        }

        public static int GetRandomTypeFromUsedTyps(List<int> typeList, ref List<int> typeUsed)
        {
            if (typeList.Count == 1)
            {
                if (!typeUsed.Any()) typeUsed.Add(typeList[0]);
                return typeList[0];
            }

            var rand = new Random();
            if (typeList.Count <= typeUsed.Count) typeUsed.Clear();

            var idx = rand.Next(0, typeList.Count);

            while (typeUsed.Contains(idx))
            {
                idx = rand.Next(0, typeList.Count);
            }

            var textureId = typeList[idx];

            typeUsed.Add(idx);

            return textureId;
        }
    }
}