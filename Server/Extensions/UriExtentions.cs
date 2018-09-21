using System;
using System.Linq;
using Server.Modules.Localize;

namespace Server.Extensions
{
    public static class UriExtentions
    {
        public static Uri CreateLocalizedUri(this Uri absolutePath)
        {
            var currentCulture = absolutePath.GetLangNameFromUri();
            return absolutePath.CreateLocalizedUri(currentCulture);
        }

        public static Uri CreateLocalizedUri(this Uri absolutePath, string targetLangKey)
        {
            var localPath = absolutePath.LocalPath;
            var orign = GetOrign(absolutePath);
            targetLangKey = targetLangKey.ToLower();
            if (localPath.Length == 1 && localPath.StartsWith("/")) orign += targetLangKey;

            else if (absolutePath.ContainLang())
                if (localPath.Length < 3)
                {
                    orign += targetLangKey + localPath;
                }
                else
                {
                    if (string.Equals(localPath.Substring(1, 2), targetLangKey,
                        StringComparison.InvariantCultureIgnoreCase))
                        return new Uri(absolutePath.AbsoluteUri);
                    var end = localPath.Substring(3);
                    orign += targetLangKey + end;
                }
            else orign += targetLangKey + localPath;
            if (orign.EndsWith("//"))
            {
                orign = orign.Substring(0, orign.Length - 1);
            }
            return new Uri(orign);
        }


        public static string GetLangNameFromUri(this Uri absolutePath)
        {
            return !absolutePath.ContainLang() ? L10N.DefaultLang : absolutePath.Segments[1].Substring(0, 2).ToLower();
        }

        public static string GetOrign(this Uri absolutePath)
        {
            if (absolutePath == null) throw new NotImplementedException("GetOrign: absolutePath == null");
            var authority = absolutePath.Authority.EndsWith(@"/")
                ? absolutePath.Authority
                : absolutePath.Authority + "/";
            return $@"{absolutePath.Scheme}://{authority}";
        }

        public static bool ContainLang(this Uri absolutePath)
        {
            if (absolutePath == null) return false;
            if (absolutePath.Segments.Length < 2) return false;
            var segment = absolutePath.Segments[1];
            if (segment.Length < 2 || segment.Length > 3) return false;
            segment = segment.Substring(0, 2);
            return L10N.SupportedCulture.Contains(segment, StringComparer.InvariantCultureIgnoreCase);
        }
    }
}