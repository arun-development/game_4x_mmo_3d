using System.Collections.Generic;

namespace Server.Utils.Map.Texture
{
    public static class TextureHelper
    {
        public const string Diffuse = "diffuse";
        public const string Bump = "bump";
        public const string Specular = "specular";
        public const string Ambient = "ambient";
        public const string Emissive = "emissive";
        public const string Opacity = "opacity";
        public const string Reflection = "reflection";
        public const string Light = "light";
        public const string Height = "height";

        #region Get

        private static TextureItemOut GetFromDictionary(string typeName,
            IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return textures[typeName];
        }

        public static TextureItemOut GetDiffuse(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Diffuse, textures);
        }

        public static TextureItemOut GetBump(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Diffuse, textures);
        }

        public static TextureItemOut GetSpecular(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Specular, textures);
        }

        public static TextureItemOut GetAmbient(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Ambient, textures);
        }

        public static TextureItemOut GetEmissive(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Emissive, textures);
        }

        public static TextureItemOut GetOpacity(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Opacity, textures);
        }

        public static TextureItemOut GetReflection(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Reflection, textures);
        }

        public static TextureItemOut GetLight(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Light, textures);
        }

        public static TextureItemOut GetHeight(IReadOnlyDictionary<string, TextureItemOut> textures)
        {
            return GetFromDictionary(Height, textures);
        }

        #endregion

        #region Set

        private static TextureItemOut SetInDictionary(TextureItemOut textureItemOut,
            Dictionary<string, TextureItemOut> textures)
        {
            return textures[textureItemOut.TextureTypeName] = textureItemOut;
        }


        public static TextureItemOut SetDiffuse(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Diffuse) textureItem.TextureTypeName = Diffuse;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetBump(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Bump) textureItem.TextureTypeName = Bump;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetSpecular(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Specular) textureItem.TextureTypeName = Specular;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetAmbient(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Ambient) textureItem.TextureTypeName = Ambient;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetEmissive(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Emissive) textureItem.TextureTypeName = Emissive;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetOpacity(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Opacity) textureItem.TextureTypeName = Opacity;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetReflection(TextureItemOut textureItem,
            Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Reflection) textureItem.TextureTypeName = Reflection;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetLight(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Light) textureItem.TextureTypeName = Light;
            return SetInDictionary(textureItem, textures);
        }

        public static TextureItemOut SetHeight(TextureItemOut textureItem, Dictionary<string, TextureItemOut> textures)
        {
            if (textureItem.TextureTypeName != Height) textureItem.TextureTypeName = Height;
            return SetInDictionary(textureItem, textures);
        }

        #endregion
    }
}