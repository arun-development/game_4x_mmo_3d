using System;
using Server.Core.Images;
using Server.Core.Interfaces.Confederation;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.Confederation
{
    public class UserOfficerOut : OfficerDataModel, IUserOfficerOut
    {
        public UserImageModel AllianceLabel { get; set; }
        public UserImageModel UserAvatar { get; set; }
        public string UserName { get; set; }
        public string AllianceName { get; set; }


        /// <summary>
        ///     по умолчанию пустышка
        /// </summary>
        public UserOfficerOut()
        {
        }

        /// <summary>
        ///     SetNoneOfficer устанавливает не назначенного офицера
        /// </summary>
        /// <param name="elected"> обязательный параметр должен быть false</param>
        /// <param name="type"></param>
        /// <exception cref="NotImplementedException">if elected = true </exception>
        /// >
        public UserOfficerOut(bool elected, OfficerTypes type)
        {
            if (elected) throw new NotImplementedException(nameof(elected));
            Type = type;
            AllianceName = "None";

            UserName = "None";
            UserAvatar = Avatar.GetIconsAdd();
            AllianceLabel = Label.GetIconsAdd();
            Elected = false;
        }

        /// <summary>
        ///     Заполняет модель базовыми значениями из базы данных
        /// </summary>
        /// <param name="other"></param>
        public UserOfficerOut(IOfficerDataModel other) : base(other)
        {
        }
    }

    public class OfficerOut : IOfficerOut
    {
        public IUserOfficerOut Elected { get; set; }
        public IUserOfficerOut Appointed { get; set; }


        public L10N Translate { get; set; }
        public OfficerStats Stats { get; set; }
        public OfficerTypes Type { get; set; }

        public OfficerOut()
        {
        }

        public OfficerOut(IOfficerBase officerBase, IUserOfficerOut elected, IUserOfficerOut appointed)
        {
            if (elected == null) throw new ArgumentNullException(nameof(elected), Error.NoData);
            Type = elected.Type;
            Elected = elected;
            Appointed = appointed;
            Translate = officerBase.Translate;
            Stats = officerBase.Stats;
            if (Appointed == null) return;
            if (Elected.Type != Appointed.Type)
                throw new NotImplementedException("Elected.Type != Appointed.Type");
        }
    }
}