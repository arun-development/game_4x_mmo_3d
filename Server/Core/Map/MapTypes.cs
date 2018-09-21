namespace Server.Core.Map
{
    public enum RingTypes : byte
    {
        Ring = 12
    }
    public enum RingTextureTypeRange : short
    {
        Start = 3001,
        End = 3100
    }
    public enum UniverseTextureTypeRange : short
    {
        Start = 4001,
        End = 4100
    }

    public enum MapTypes : byte
    {
        Galaxy = 0,
        Sector = 1,
        Star = 2,
        Planet = 3,
        Satellite = 4,
        Mother = 5,
        Universe = 6
    }

    public enum PlanetoidSubTypes : byte
    {
        A = 1,
        B = 2,
        F = 3,
        G = 4,
        K = 5,
        L = 6,
        M = 7,
        O = 8,
        Earth = 9,
        Gas = 10,
        IceGas = 11,
        Moon = 13
    }

    public enum GroundSubTypes : byte
    {
        Erth = 15,
        Gas = 16,
        IceGas = 17
    }


    public enum GalaxySubTypes
    {
        Spirale = 21
    }
}