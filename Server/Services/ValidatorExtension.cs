using System;
using System.Text.RegularExpressions;
using Server.Core.StaticData;

namespace Server.Services
{
    public static class ValidatorExtension
    {
        public static void ValidateUniqueNameFormat(this string uniqueName)
        {
            var pattern = @"^[A-Z]{1}[A-Z0-9_-]{2,12}[A-Z0-9]$";
            var valid = Regex.IsMatch(uniqueName, pattern, RegexOptions.IgnoreCase);
            if (!valid) throw new Exception(Error.InvalidFormat);
        }


        public static void ValidateAllianceName(this string allianceName)
        {
            if (string.IsNullOrWhiteSpace(allianceName)) throw new ArgumentNullException(Error.IsEmpty);
            if (allianceName.Length < (int) MinLenghtConsts.AllianceName)
                throw new ArgumentNullException(Error.LessMin);
            if (allianceName.Length > (int) MaxLenghtConsts.AllianceName)
                throw new ArgumentNullException(Error.OverMaxLength);
            allianceName.ValidateUniqueNameFormat();
        }

        public static void ValidateChannelName(this string channelName)
        {
            if (string.IsNullOrWhiteSpace(channelName)) throw new ArgumentNullException(Error.IsEmpty);
            if (channelName.Length < (int) MinLenghtConsts.ChannelName) throw new ArgumentNullException(Error.LessMin);
            if (channelName.Length > (int) MaxLenghtConsts.ChannelName)
                throw new ArgumentNullException(Error.OverMaxLength);
            channelName.ValidateUniqueNameFormat();
        }

        public static void ValidateIcon(this string icon)
        {
            if (string.IsNullOrWhiteSpace(icon)) throw new ArgumentNullException(Error.IsEmpty);
            if (icon.Length < (int) MinLenghtConsts.UserImagesIcon)
                throw new ArgumentNullException(nameof(icon), Error.LessMin);
            if (icon.Length > (int) MaxLenghtConsts.UserImagesDbMax)
                throw new ArgumentNullException(nameof(icon), Error.OverMaxLength);
        }

        public static void ValidateSerchChannelName(this string partChannelName)
        {
            if (string.IsNullOrWhiteSpace(partChannelName)) throw new ArgumentNullException(Error.IsEmpty);
            if (partChannelName.Length < (int) MinLenghtConsts.SerchChannelName)
                throw new ArgumentNullException(nameof(partChannelName), Error.LessMin);
            if (partChannelName.Length > (int) MaxLenghtConsts.ChannelName)
                throw new ArgumentNullException(nameof(partChannelName), Error.OverMaxLength);
        }
    }
}