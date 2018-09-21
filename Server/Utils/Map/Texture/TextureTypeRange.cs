using Server.Core.Map;

namespace Server.Utils.Map.Texture
{
    public class TextureTypeRange
    {
        public TextureTypeRange(short from, short to)
        {
            From = from;
            To = to;
        }

        public short From { get; }
        public short To { get; }
    }

    public static class TextureTypeMap
    {
        public static readonly TextureTypeRange Galaxy = new TextureTypeRange(1, 100);
        public static readonly TextureTypeRange Sector = new TextureTypeRange(201, 300);

        public static readonly TextureTypeRange Star = new TextureTypeRange(301, 400);

        public static readonly TextureTypeRange Earth = new TextureTypeRange(401, 500);
        public static readonly TextureTypeRange Gas = new TextureTypeRange(501, 600);
        public static readonly TextureTypeRange IceGas = new TextureTypeRange(601, 700);
        public static readonly TextureTypeRange Moon = new TextureTypeRange(901, 1000);

        public static readonly TextureTypeRange Mother = new TextureTypeRange(2000, 2000);
        public static readonly TextureTypeRange Ring = new TextureTypeRange((short)RingTextureTypeRange.Start, ((short)RingTextureTypeRange.End));
    }
}