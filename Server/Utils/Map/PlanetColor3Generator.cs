using Server.Core.Map;
using Server.Core.СompexPrimitive;
using Server.Extensions;

namespace Server.Utils.Map
{
    public static class PlanetTypedColors
    {
        private static readonly Color3 Erth = Color3.SetColor(100, 160, 210);
        private static readonly Color3 Gas = Color3.SetColor(160, 140, 100);
        private static readonly Color3 IceGas = Color3.SetColor(150, 180, 200);
        private static readonly Color3 Moon = Color3.SetColor(200, 200, 200);

        public static Color3 GetColorByType(byte typeId)
        {
            switch (typeId)
            {
                case (byte) PlanetoidSubTypes.Earth:
                    return Erth.CloneDeep();
                case (byte) PlanetoidSubTypes.Gas:
                    return Gas.CloneDeep();
                case (byte) PlanetoidSubTypes.IceGas:
                    return IceGas.CloneDeep();
                case (byte) PlanetoidSubTypes.Moon:
                    return Moon.CloneDeep();
                default:
                    return new Color3();
            }
        }
    }


    public static class PlanetColor3Generator
    {
        public static Color3 CreateColorByType(byte typeId)
        {
            const int deveation = 30;
            var color = PlanetTypedColors.GetColorByType(typeId);
            color.DeviateColor(deveation);
            return color;
        }
    }
}