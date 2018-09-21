using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Server.Core.Battle;
using Server.Core.Images;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.Core.Map.Structure;
using Server.Core.StaticData;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Other;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.Modules.Localize;

namespace Server.DataLayer
{
    #region  store props

    public interface IProductTypeIdProperty
    {
        byte ProductTypeId { get; set; }
    }

    public interface IProductStoreIdProperty
    {
        short ProductStoreId { get; set; }
    }

    #endregion

    #region WorkMapAdressProperties

    public interface IGalaxyIdProperty
    {
        byte GalaxyId { get; set; }
    }

    public interface ISectorIdProperty
    {
        short SectorId { get; set; }
    }

    public interface ISystemIdProperty
    {
        int SystemId { get; set; }
    }

    public interface IPlanetIdProperty
    {
        int PlanetId { get; set; }
    }


    public interface ISectorAdress : IUniqueIdElement<short>, IGalaxyIdProperty
    {
    }

    public interface ISystemAdress : IUniqueIdElement<int>, IGalaxyIdProperty, ISectorIdProperty
    {
    }

    public interface IPlanetAdress : IUniqueIdElement<int>, IGalaxyIdProperty, ISectorIdProperty, ISystemIdProperty
    {
    }

    public interface IMoonAdress : IUniqueIdElement<int>, IGalaxyIdProperty, ISectorIdProperty, ISystemIdProperty,
        IPlanetIdProperty
    {
    }

    #endregion

    #region Properties

    public interface IUserIdProperty
    {
        int UserId { get; set; }
    }

    public interface ITranslateL10NProperty
    {
        L10N Translate { get; set; }
    }

    public interface IDescriptionL10NProperty
    {
        L10N Description { get; set; }
    }

    public interface INameProperty
    {
        string Name { get; set; }
    }

    public interface IDisbandetProperty
    {
        bool Disbandet { get; set; }
    }

    public interface IChannelIdProperty
    {
        int ChannelId { get; set; }
    }

    public interface IChannelTypeProperty
    {
        ChannelTypes ChannelType { get; set; }
    }

    public interface IMessageReadProperty
    {
        bool MessageRead { get; set; }
    }

    public interface IMessageSendProperty
    {
        bool MessageSend { get; set; }
    }

    public interface IDateCreateIntProperty
    {
        int DateCreate { get; set; }
    }

    public interface IUserNameProperty
    {
        string UserName { get; set; }
    }

    public interface IPvpPointroperty
    {
        int PvpPoint { get; set; }
    }

    public interface IAllianceIdPointroperty
    {
        int AllianceId { get; set; }
    }

    public interface IAllianeNamePointroperty
    {
        string AllianeName { get; set; }
    }

    #endregion

    public interface IUniqueIdElement<T> where T : struct
    {
        T Id { get; set; }
    }

    public interface IUniqueIdElement : IUniqueIdElement<int>
    {
    }

    public interface IDataModel<TKeyType> where TKeyType : struct
    {
        TKeyType Id { get; set; }
        bool IsNewDataModel();
    }

    public abstract class BaseDataModel<TKeyType> : IDataModel<TKeyType> where TKeyType : struct
    {
        [Required]
        [Key]
        public virtual TKeyType Id { get; set; }

        public virtual bool IsNewDataModel()
        {
            return Id.Equals(default(TKeyType));
        }
    }


    #region Alliance DataModels

    public class AllianceDataModel : BaseDataModel<int>, INameProperty, IDisbandetProperty
    {
        public int CreatorId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string CreatorName { get; set; }

        public DateTime DateCreate { get; set; }
        public int DateDisband { get; set; }

        [MaxLength(L10N.DefaultMaxLength)]
        public virtual string Description { get; set; }

        [Required]
        [MaxLength(UserImageModel.DefaultMaxLength)]
        public UserImageModel Images { get; set; }

        public int PvpRating { get; set; }
        public byte Tax { get; set; }
        public int Cc { get; set; }
        public bool Disbandet { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        [Required]
        public string Name { get; set; }
    }

    public class AllianceFleetDataModel : BaseDataModel<int>, IAllianceIdPointroperty
    {
        [Required]
        public int CreatorId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string CreatorName { get; set; }

        [Required]
        public int FleetIdCreator { get; set; }

        public List<int> FleetIds { get; set; }

        [Required]
        public int AllianceId { get; set; }
    }


    public class AllianceRequestMessageDataModel : BaseDataModel<int>, IAllianceUserAccept, IDateCreateIntProperty
    {
        public MessageSourceType SourceType { get; set; }

        public int FromId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string FromName { get; set; }

        public int ToId { get; set; }


        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string ToName { get; set; }

        [MaxLength((int) MaxLenghtConsts.DescriptionLangDescriptionMax)]
        public string Message { get; set; }

        [MaxLength((int) MaxLenghtConsts.UserImagesDbMax)]
        public string CreatorIcon { get; set; }

        public bool UserAccepted { get; set; }
        public ArmAllianceAcceptedStatus AllianceAccepted { get; set; }
        public int DateCreate { get; set; }
    }

    public class AllianceRequestMessageHistoryDataModel : AllianceRequestMessageDataModel
    {
        public int OldArmId { get; set; }
        public int DateDelete { get; set; }
    }

    public class AllianceRoleDataModel : BaseDataModel<byte>, IMessageReadProperty, IMessageSendProperty
    {
        [Required]
        public bool EditAllianceInfo { get; set; }

        [Required]
        public bool ShowManage { get; set; }

        [Required]
        public bool SetTech { get; set; }

        [Required]
        public bool CanManagePermition { get; set; }

        [Required]
        public bool AcceptNewMembers { get; set; }

        [Required]
        public bool DeleteMembers { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string RoleName { get; set; }

        [Required]
        public bool MessageRead { get; set; }

        [Required]
        public bool MessageSend { get; set; }
    }

    public class AllianceTechDataModel : BaseDataModel<int>
    {
        public Dictionary<TechType, ItemProgress> Teches { get; set; }
    }

    public class AllianceUserDataModel : BaseDataModel<int>, IUserIdProperty, IAllianceIdPointroperty
    {
        [Required]
        public DateTime DateCreate { get; set; }

        [Required]
        public byte RoleId { get; set; }

        [Required]
        public int AllianceId { get; set; }

        [Required]
        public int UserId { get; set; }
    }

    public class AllianceUserHistoryDataModel : AllianceUserDataModel
    {
        [Required]
        public int DateLeave { get; set; }

        public bool Leave { get; set; }
        public bool Disbandet { get; set; }
    }

    #endregion

    #region UserChannels DataModels

    public enum ChannelTypes : byte
    {
        Private = 1,
        Group = 2,
        Alliance = 3
    }

    public interface IBaseChannelDataModel : IChannelTypeProperty, IDateCreateIntProperty
    {
        string ChannelName { get; set; }
        int CreatorId { get; set; }
        string CreatorName { get; set; }
        string ChannelIcon { get; set; }
    }


    public class ChannelDataModel : BaseDataModel<int>, IBaseChannelDataModel
    {
        [MaxLength((int) MaxLenghtConsts.PasswordDbMax)]
        public string Password { get; set; }

        public virtual List<ChannelConnectionDataModel> ChannelConnections { get; set; }

        public ChannelTypes ChannelType { get; set; }

        [MaxLength((int) MaxLenghtConsts.ChannelNameDbMax)]
        public string ChannelName { get; set; }

        public int DateCreate { get; set; }
        public int CreatorId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string CreatorName { get; set; }

        [MaxLength((int) MaxLenghtConsts.UserImagesDbMax)]
        public string ChannelIcon { get; set; }
    }


    public interface IChannelConnectionBase : IDataModel<long> , IUserIdProperty, IChannelIdProperty,
        IMessageReadProperty, IMessageSendProperty, IChannelTypeProperty
    {
    }

    public class ChannelConnectionBase : BaseDataModel<long>, IChannelConnectionBase
    {
        public ChannelConnectionBase()
        {
        }

        public ChannelConnectionBase(IChannelConnectionBase other)
        {
            Id = other.Id;
            UserId = other.UserId;
            ChannelId = other.ChannelId;
            MessageRead = other.MessageRead;
            MessageSend = other.MessageSend;
            ChannelType = other.ChannelType;
        }

        public int UserId { get; set; }
        public int ChannelId { get; set; }
        public bool MessageRead { get; set; }
        public bool MessageSend { get; set; }
        public ChannelTypes ChannelType { get; set; }
    }

    public class ChannelConnectionDataModel : ChannelConnectionBase
    {
        [MaxLength((int) MaxLenghtConsts.PasswordDbMax)]
        public string Password { get; set; }
    }

    public class ChannelMessageDataModel : BaseDataModel<long>, IUserIdProperty, IChannelIdProperty,
        IDateCreateIntProperty, IUserNameProperty
    {
        public string UserIcon { get; set; }
        public string Message { get; set; }

        public int ChannelId { get; set; }
        public int DateCreate { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }

        protected void Update(ChannelMessageDataModel other)
        {
            if (Id != other.Id) Id = other.Id;
            if (ChannelId != other.ChannelId) ChannelId = other.ChannelId;
            if (UserId != other.UserId) UserId = other.UserId;
            if (UserName != other.UserName) UserName = other.UserName;
            if (UserIcon != other.UserIcon) UserIcon = other.UserIcon;
            if (Message != other.Message) Message = other.Message;
            if (DateCreate != other.DateCreate) DateCreate = other.DateCreate;
        }
    }

    #endregion

    #region World DataModels

    // not for db
    public abstract class BaseGeometryDataModel<T> : BaseDataModel<T> where T : struct
    {
        [Required]
        public byte TypeId { get; set; }

        [Required]
        public short TextureTypeId { get; set; }
    }

    public class GDetailMoonDataModel : BaseDataModel<int>, IDescriptionL10NProperty, INameProperty
    {
        //[MaxLength(L10N.DefaultMaxLength)]
        [Required]
        public L10N Description { get; set; }


        [Required]
        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string Name { get; set; }
    }

    public class GDetailPlanetDataModel : BaseDataModel<int>, IDescriptionL10NProperty, INameProperty,
        IAllianceIdPointroperty
    {
        [Required]
        public byte MoonCount { get; set; }

        public int UserId { get; set; }

        [Required]
        public DateTime LastActive { get; set; }

        [Required]
        public byte DangerLevel { get; set; }

        [Required]
        public StorageResources Resources { get; set; }

        [Required]
        public Dictionary<UnitType, int> Hangar { get; set; }

        [Required]
        public ItemProgress BuildSpaceShipyard { get; set; }

        [Required]
        public ItemProgress BuildExtractionModule { get; set; }

        [Required]
        public ItemProgress BuildEnergyConverter { get; set; }

        [Required]
        public ItemProgress BuildStorage { get; set; }

        [Required]
        public ItemProgress Turels { get; set; }

        public Dictionary<UnitType, TurnedUnit> UnitProgress { get; set; }

        [Required]
        public MaterialResource ExtractionProportin { get; set; }

        public int LastUpgradeProductionTime { get; set; }

        public int AllianceId { get; set; }

        //[MaxLength(L10N.DefaultMaxLength)]
        [Required]
        public L10N Description { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        [Required]
        public string Name { get; set; }
    }

    //todo  почему у коллекции  GDetailSystemDataModel есть поле typeId  которео должно относится к модели GGeometryStarDataModel
    public class GDetailSystemDataModel : BaseDataModel<int>, IDescriptionL10NProperty, IUserNameProperty,
        IAllianceIdPointroperty
    {
        public byte TypeId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string Name { get; set; }

        public double EnergyBonus { get; set; }

        public int AllianceId { get; set; }

        //  [MaxLength(L10N.DefaultMaxLength)] in string
        public L10N Description { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string UserName { get; set; }
    }

    public class GGalaxyDataModel : BaseGeometryDataModel<byte>, INativeName, ITranslateL10NProperty
    {
        public Vector3 Position { get; set; }
        public bool Opened { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string NativeName { get; set; }

        //[MaxLength(L10N.DefaultMaxLength)] in string
        public L10N Translate { get; set; }
    }

    public class GGameTypeDataModel : BaseDataModel<byte>, IDescriptionL10NProperty
    {
        [MaxLength((int) MaxLenghtConsts.PropertyName)]
        public string Type { get; set; }

        [MaxLength((int) MaxLenghtConsts.PropertyName)]
        public string SubType { get; set; }

        //  [MaxLength(L10N.DefaultMaxLength)] in string
        public L10N Description { get; set; }
    }

    public class GGeometryMoonDataModel : BaseGeometryDataModel<int>, IMoonAdress
    {
        public double Radius { get; set; }
        public double Orbit { get; set; }
        public Vector3 OrbitAngle { get; set; }
        public Vector3 AxisAngle { get; set; }
        public Color3 Color { get; set; }

        public byte OrbitPosition { get; set; }

        [Required]
        public byte GalaxyId { get; set; }

        [Required]
        public short SectorId { get; set; }

        [Required]
        public int SystemId { get; set; }

        [Required]
        public int PlanetId { get; set; }
    }

    public class GGeometryPlanetDataModel : BaseGeometryDataModel<int>, IPlanetAdress
    {
        public double Radius { get; set; }

        public int? RingTypeId { get; set; }


        public double Orbit { get; set; }
        public Vector3 OrbitAngle { get; set; }
        public Vector3 AxisAngle { get; set; }
        public byte SystemPosition { get; set; }
        public Color3 Color { get; set; }

        public byte OrbitPosition { get; set; }

        [Required]
        public byte GalaxyId { get; set; }

        [Required]
        public short SectorId { get; set; }

        [Required]
        public int SystemId { get; set; }
    }

    public class GGeometryStarDataModel : BaseGeometryDataModel<int>
    {
        public double Radius { get; set; }
    }

    public class GGeometrySystemDataModel : BaseDataModel<int>
    {
        public Planetoids Planetoids { get; set; }
    }

    public class GSectorsDataModel : BaseGeometryDataModel<short>, ISectorAdress, INativeName, ITranslateL10NProperty
    {
        //[MaxLength(100)] in string
        public Vector3 Position { get; set; }

        public bool Opened { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string NativeName { get; set; }

        [Required]
        public byte GalaxyId { get; set; }

        //[MaxLength(L10N.DefaultMaxLength)] in string
        public L10N Translate { get; set; }
    }

    public class GSystemDataModel : BaseDataModel<int>, ISystemAdress
    {
        //[MaxLength(100)] instring
        public Vector3 Position { get; set; }

        [Required]
        public byte GalaxyId { get; set; }

        [Required]
        public short SectorId { get; set; }
    }

    public class GTextureTypeDataModel : BaseDataModel<short>
    {
        public byte GameTypeId { get; set; }
    }

    public class SysHelperDataModel : BaseDataModel<int>
    {
        [MaxLength(128)]
        public string TypeName { get; set; }

        public string Value { get; set; }
    }

    #endregion

    #region Store DataModels

    public class CurrencyDataModel : BaseDataModel<int>
    {
        [MaxLength(5)]
        public string Code { get; set; }

        public decimal Course { get; set; }
    }

    public class ProductStoreDataModel : BaseDataModel<short>, IProductTypeIdProperty
    {
        [Required]
        public string CurrencyCode { get; set; }

        [Required]
        public decimal Cost { get; set; }

        [Required]
        public bool Trash { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public ProductItemProperty Property { get; set; }


        [Required]
        public byte ProductTypeId { get; set; }
    }

    public class ProductTypeDataModel : BaseDataModel<byte>, INameProperty
    {
        public ProductItemProperty Property { get; set; }

        [MaxLength((int) MaxLenghtConsts.PropertyName)]
        public string Name { get; set; }
    }

    #endregion


    #region User DataModels

    public class UserBalanceCcDataModel : BaseDataModel<int>, ICreateNew<UserBalanceCcDataModel>
    {
        public int Quantity { get; set; }
        public DateTime DateUpdate { get; set; }

        public UserBalanceCcDataModel()
        {
           
                
            
        }
        protected UserBalanceCcDataModel(UserBalanceCcDataModel other)
        {
            Id = other.Id;
            DateUpdate = other.DateUpdate;
            Quantity = other.Quantity;
        }

        public UserBalanceCcDataModel CreateNew(UserBalanceCcDataModel other)
        {
            return new UserBalanceCcDataModel(other);
        }

        public UserBalanceCcDataModel CreateNewFromThis()
        {
            return new UserBalanceCcDataModel(this);
        }
    }

    public class UserBookmarkDataModel : BaseDataModel<int>, IUserIdProperty
    {
        public int ObjectId { get; set; }
        public byte TypeId { get; set; }

        [Required]
        public int UserId { get; set; }
    }

    public class JournalBuyDataModel : BaseDataModel<int>
    {
        public bool TransactionType { get; set; }
        public int TransactionId { get; set; }
    }

    public class UserPremiumDataModel : BaseDataModel<int>
    {
        public int EndTime { get; set; }
        public bool AutoPay { get; set; }
        public bool Finished { get; set; }
        public Dictionary<int, UserPremiumtHistory> Data { get; set; }
    }


    public class TransacationCcDataModel : BaseDataModel<int>, IProductStoreIdProperty, IUserIdProperty
    {
        public int Quantity { get; set; }
        public sbyte Source { get; set; }
        public decimal TotalCost { get; set; }

        [MaxLength(22)]
        public string Token { get; set; }

        [MaxLength(256)]
        public string FormToken { get; set; }

        public DateTime DateCreate { get; set; }
        public short ProductStoreId { get; set; }

        [Required]
        public int UserId { get; set; }
    }

    public class UserMotherJumpDataModel : BaseDataModel<int>
    {
        public int MotherId { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public bool CancelJump { get; set; }
        public bool Completed { get; set; }
        public int StartSystem { get; set; }
        public int TargetSystem { get; set; }
    }

    public class UserReportDataModel : BaseDataModel<int>
    {
        public int TaskId { get; set; }
        public MaterialResource Resources { get; set; }
        public int BattleTime { get; set; }
        public List<Round> RoundsLog { get; set; }

        public int DefenderUserId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string DefenderUserName { get; set; }


        public BattleFleets AtackerSummaryReport { get; set; }
        public BattleFleets DefenderSummaryReport { get; set; }


        public bool AtackerDeleteReport { get; set; }
        public bool DefenderDeleteReport { get; set; }

        public int AtackerUserId { get; set; }
        public bool AtackerWin { get; set; }
        public bool AtackerIsSkagry { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string AtackerUserName { get; set; }

        [MaxLength((int) MaxLenghtConsts.PropertyName)]
        public BattleResult AtackerResultStatus { get; set; }
    }

    public class UserChestDataModel : BaseDataModel<int>, IProductTypeIdProperty, IUserIdProperty,
        IDateCreateIntProperty
    {
        public int TransactionsgId { get; set; }
        public bool Activated { get; set; }
        public bool Finished { get; set; }
        public int? DateActivate { get; set; }
        public short ProductStoreId { get; set; }
        public int DateCreate { get; set; }
        public byte ProductTypeId { get; set; }

        [Required]
        public int UserId { get; set; }
    }

    public class UserDataModel : BaseDataModel<int>, IPvpPointroperty
    {
        public const int JoinJoAlllianceBlockedTime = UnixTime.OneDayInSecond;

        [MaxLength(128)]
        public virtual string AuthId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public virtual string Nickname { get; set; }

        public DateTime DateCreate { get; set; }
        public byte Status { get; set; }
        public int LeaveAllianceTime { get; set; }
        public bool IsNpc { get; set; }
        public bool IsOnline { get; set; }
        public int DateLastLeft { get; set; }
        public int DateLastJoin { get; set; }
        public UserImageModel Avatar { get; set; }
        public string Description { get; set; }
        public Dictionary<int, MeedDbModel> MeedsQuantity { get; set; }
        public int PvpPoint { get; set; }
    }

    public class UserMothershipDataModel : BaseDataModel<int>
    {
        public int StartSystemId { get; set; }
        public StorageResources Resources { get; set; }
        public virtual Dictionary<UnitType, int> Hangar { get; set; }
        public virtual Dictionary<UnitType, TurnedUnit> UnitProgress { get; set; }
        public ItemProgress LaboratoryProgress { get; set; }
        public MaterialResource ExtractionProportin { get; set; }
        public Dictionary<TechType, ItemProgress> TechProgress { get; set; }
        public int LastUpgradeProductionTime { get; set; }
    }


    public class UserSpyDataModel : BaseDataModel<int>
    {
        public int SourceUserId { get; set; }
        public int TargetPlanetId { get; set; }
        public byte TargetPlanetTypeId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string TargetPlanetName { get; set; }

        public Dictionary<UnitType, int> TargetPlanetHangar { get; set; }

        public MaterialResource TargetResource { get; set; }

        // (UserImageModel.DefaultMaxLength)] in string
        public UserImageModel TargetUserImage { get; set; }
        // (UserImageModel.DefaultMaxLength)] in string

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string TargetUserName { get; set; }

        public int DateActivate { get; set; }
    }

    public class UserTaskDataModel : BaseDataModel<int>
    {
        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string SourceSystemName { get; set; }

        public int SourceUserId { get; set; }
        public int SourceOwnId { get; set; }

        public bool SourceOwnType { get; set; } //mother or planet

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string SourceOwnName { get; set; }

        public byte SourceTypeId { get; set; }
        public Dictionary<UnitType, int> SourceFleet { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsAtack { get; set; }
        public int DateActivate { get; set; }
        public int Duration { get; set; }

        public bool Canselation { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string TargetSystemName { get; set; }

        public int TargetPlanetId { get; set; }

        public byte TargetPlanetTypeId { get; set; }

        [MaxLength((int) MaxLenghtConsts.UniqueName)]
        public string TargetPlanetName { get; set; }

        public bool TaskEnd { get; set; }
    }

    #endregion


    #region Confederation 

    public class OfficerDataModel : BaseDataModel<int>, IOfficerDataModel
    {
        public OfficerDataModel()
        {
        }

        public OfficerDataModel(IOfficerDataModel other)
        {
            if (other == null) return;
            Id = other.Id;
            Type = other.Type;
            UserId = other.UserId;
            AllianceId = other.AllianceId;
            Elected = other.Elected;
            AppointedUserId = other.AppointedUserId;

            DateStart = other.DateStart;
            DateEnd = other.DateEnd;
        }

        public OfficerTypes Type { get; set; }
        public int UserId { get; set; }

        public int? AllianceId { get; set; }

        public bool Elected { get; set; }
        public int? AppointedUserId { get; set; }
        public int DateStart { get; set; }
        public int DateEnd { get; set; }
    }


    public class OfficerCandidatDataModel:BaseDataModel<int>, IUserIdProperty,IDateCreateIntProperty
    {

        public int UserId { get; set; }
        public int DateCreate { get; set; }
        public int Voices { get; set; }
        public bool IsFinalizer { get; set; }

    }

    #endregion
}