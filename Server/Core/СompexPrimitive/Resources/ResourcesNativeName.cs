using System.Collections.Generic;

namespace Server.Core.СompexPrimitive.Resources
{
    public static class ResourcesNativeName
    {
        public const string E =nameof(MaterialResource.E);
        public const string Ir = nameof(MaterialResource.Ir);
        public const string Dm = nameof(MaterialResource.Dm);
        public const string Cc = nameof(GameResource.Cc);
        public static IReadOnlyList<string> ResNames = new List<string>{E,Ir,Dm,Cc};

    }
}