using System.Collections.Generic;
using Server.Core.Map;

namespace Server.Utils.Map.Texture

{
    [System.Obsolete]
    public static class MapCatalog
    {

        public static List<TextureItemOut> PlanetSpaceTextures;
        public static List<TextureItemOut> PlanetGroundTextures;
        static MapCatalog()
        {
            var cm = new MapCatalogHelper();
            PlanetSpaceTextures = cm.CreatePlanetSpaceTextures();
            PlanetGroundTextures = cm.CreatePlanetGroundTextures();
        }

        private class MapCatalogHelper
        {
            private const string Ground = "ground";
            private const string Jpg = ".jpg";
            private const string Planetoid = "planetoid";

            private readonly int _erthStart = TextureTypeMap.Earth.From;
            private readonly int _erthEnd = TextureTypeMap.Earth.To;

            private readonly int _gasStart = TextureTypeMap.Gas.From;
            private readonly int _gasEnd = TextureTypeMap.Gas.To;

            private readonly int _iceGasStart = TextureTypeMap.IceGas.From;
            private readonly int _iceGasEnd = TextureTypeMap.IceGas.To;


            private readonly int _moonStart = TextureTypeMap.Moon.From;
            private readonly int _moonEnd = TextureTypeMap.Moon.To;

            private readonly int _starStart = TextureTypeMap.Star.From;
            private readonly int _starEnd = TextureTypeMap.Star.To;

            private readonly string _earth = PlanetoidSubTypes.Earth.ToString().ToLower();
            private readonly string _gas = PlanetoidSubTypes.Gas.ToString().ToLower();
            private readonly string _iceGas = PlanetoidSubTypes.IceGas.ToString().ToLower();


            private readonly string _moonName = PlanetoidSubTypes.Moon.ToString().ToLower();
            private readonly string _planetName = MapTypes.Planet.ToString().ToLower();
            private readonly string _starName = MapTypes.Star.ToString().ToLower();

            public MapCatalogHelper()
            {

            }


            private static List<TextureItemOut> CteateTextures(int startTId, int endTId, string groupName, string textureTypeName,
                string baseName,
                string ext, bool isGround = false)
            {
                var list = new List<TextureItemOut>();

                var count = endTId - startTId+1;
                for (var i = startTId; i <= count; i++ )
                {
                    var citem = new Catalog(Planetoid, groupName, baseName);

                    var isGroundTexture = isGround ? Ground : null;
                    list.Add(new TextureItemOut
                    {
                        BaseName = baseName,
                        TextureTypeId = i,
                        FileName = citem.CreateFileName(textureTypeName, i, ext),
                        LocalUrl = citem.CreateServerPath(textureTypeName, i, ext, isGroundTexture),
                        CdnUrl = citem.CreaateCdnPath(textureTypeName, i, ext, isGroundTexture),
                        TextureTypeName = textureTypeName
                    });
                }
                return list;
            }

            public List<TextureItemOut> CreatePlanetSpaceTextures()
            {
                var erthDiffuse = CteateTextures(_erthStart, _erthEnd, _planetName, TextureHelper.Diffuse, _earth, Jpg);
                var gasDiffuse = CteateTextures(_gasStart, _gasEnd, _planetName, TextureHelper.Diffuse, _gas, Jpg);
                var iceGasDiffuse = CteateTextures(_iceGasStart, _iceGasEnd, _planetName, TextureHelper.Diffuse, _iceGas, Jpg);


                erthDiffuse.AddRange(gasDiffuse);
                erthDiffuse.AddRange(iceGasDiffuse);

                return erthDiffuse;
            }


            public List<TextureItemOut> CreatePlanetGroundTextures()
            {
                var erthDiffuse = CteateTextures(_erthStart, _erthEnd, _planetName, TextureHelper.Diffuse, _earth, Jpg, true);
                var gasDiffuse = CteateTextures(_gasStart, _gasEnd, _planetName, TextureHelper.Diffuse, _gas, Jpg, true);
                var iceGasDiffuse = CteateTextures(_iceGasStart, _iceGasEnd, _planetName, TextureHelper.Diffuse, _iceGas, Jpg, true);

                erthDiffuse.AddRange(gasDiffuse);
                erthDiffuse.AddRange(iceGasDiffuse);

                var erthBump = CteateTextures(_erthStart, _erthEnd, _planetName, TextureHelper.Bump, _earth, Jpg, true);
                var gasBump = CteateTextures(_gasStart, _gasEnd, _planetName, TextureHelper.Bump, _gas, Jpg, true);
                var iceGasBump = CteateTextures(_iceGasStart, _iceGasEnd, _planetName, TextureHelper.Bump, _iceGas, Jpg, true);
                erthDiffuse.AddRange(erthBump);
                erthDiffuse.AddRange(gasBump);
                erthDiffuse.AddRange(iceGasBump);

                var erthHeight = CteateTextures(_erthStart, _erthEnd, _planetName, TextureHelper.Height, _earth, Jpg, true);
                var gasHeight = CteateTextures(_gasStart, _gasEnd, _planetName, TextureHelper.Height, _gas, Jpg, true);
                var iceGasHeight = CteateTextures(_iceGasStart, _iceGasEnd, _planetName, TextureHelper.Height, _iceGas, Jpg, true);

                erthDiffuse.AddRange(erthHeight);
                erthDiffuse.AddRange(gasHeight);
                erthDiffuse.AddRange(iceGasHeight);

                return erthDiffuse;
            }

            private class Catalog
            {
                private const string CdnStorageUrl = "https://eternplaypublic.blob.core.windows.net/";
                private readonly string _baseName;
                private readonly string _relativePath;

                private const string CdnMapCatalog = CdnStorageUrl + "materials/map/";

                private const string LocalMapCatalog = "/Content/Materiales/map/";


                public Catalog(string section, string groupName, string baseName, bool setMultipleGroupName = true)
                {
                    if (setMultipleGroupName) groupName = groupName + "s";
                    _baseName = baseName;
                    _relativePath = section + "/" + groupName + "/";
                }


                private string GetGroupPath(bool isLocal)
                {
                    return isLocal ? LocalMapCatalog + _relativePath : CdnMapCatalog + _relativePath;
                }

                public string CreateFileName(string prefix, int itemNum, string ext)
                {
                    return prefix + "_" + _baseName + itemNum + ext;
                }


                private string CreatePath(string prefix, int itemNum, string ext, bool isLocal, string childCatalog = null)
                {
                    var fname = CreateFileName(prefix, itemNum, ext);
                    var groupPath = GetGroupPath(isLocal);
                    if (childCatalog == null) return groupPath + fname;
                    if (!childCatalog.Contains("/")) childCatalog = childCatalog + "/";
                    return groupPath + childCatalog + fname;
                }

                public string CreateServerPath(string prefix, int itemNum, string ext, string childCatalog = null)
                {
                    return CreatePath(prefix, itemNum, ext, true, childCatalog);
                }

                public string CreaateCdnPath(string prefix, int itemNum, string ext, string childCatalog = null)
                {
                    return CreatePath(prefix, itemNum, ext, false, childCatalog);
                }
            }


        }

    }

}