using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Core.StaticData;
using Server.Modules.Localize;

namespace Server.DataLayer
{
    #region No Resharper

    // ReSharper disable InconsistentNaming

    #region IDbProperties

    public interface IDbPropertyPosition
    {
        [MaxLength((int)MaxLenghtConsts.Vector3Double)]
        string position { get; set; }
    }

    public interface IDbPropertyTranslate
    {
        [MaxLength(L10N.DefaultMaxLength)]
        string translate { get; set; }
    }

    //todo  переименовать в транслейте или наоборот
    public interface IDbPropertyDescription
    {
        [MaxLength(L10N.DefaultMaxLength)]
        string description { get; set; }
    }

    public interface IDbPropertyNativeName
    {

        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string nativeName { get; set; }
    }

    public interface IDbPropertyCustomName
    {

        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string name { get; set; }
    }

    public interface IDbPropertyDateCreateDT
    {
        DateTime dateCreate { get; set; }
    }

    public interface IDbPropertyDateCreateInt
    {
        int dateCreate { get; set; }
    }

    public interface IDbPropertyUserId
    {
        int userId { get; set; }
    }

    public interface IDbPropertyAllianceId
    {
        int allianceId { get; set; }
    }

    public interface IDbPropertyOrbitAngle
    {
        [MaxLength((int)MaxLenghtConsts.Vector3Double)]
        string orbitAngle { get; set; }
    }

    public interface IDbPropertyColor
    {
        [MaxLength((int)MaxLenghtConsts.Vector3Double)]
        string color { get; set; }
    }

    public interface IDbPropertyAxisAngle
    {
        [MaxLength((int)MaxLenghtConsts.Vector3Double)]
        string axisAngle { get; set; }
    }



    public interface IDbPropertyProductStoreId
    {
        short productStoreId { get; set; }
    }

    public interface IDbPropertyProductTypeId
    {
        byte productTypeId { get; set; }
    }

    #endregion

    #region MapAdressProperties
    public interface IDbSectorAdress
    {
        byte galaxyId { get; set; }

    }
    public interface IDbSystemAdress : IDbSectorAdress
    {
        short sectorId { get; set; }

    }

    public interface IDbPlanetAdress : IDbSystemAdress
    {
        int systemId { get; set; }

    }
    public interface IDbMoonAdress : IDbPlanetAdress
    {
        int planetId { get; set; }
    }






    #endregion

    #region Tables

    #region Alliance

    public interface IAllianceDbItem : IUniqueIdElement<int>, IDbPropertyDateCreateDT, IDbPropertyCustomName,
        IDbPropertyDescription
    {
        int creatorId { get; set; }


        string creatorName { get; set; }

        int? dateDisband { get; set; }

        [MaxLength((int)MaxLenghtConsts.UserImagesDbMax)]
        string images { get; set; }

        int pvpRating { get; set; }
        bool disbandet { get; set; }
        byte tax { get; set; }
        int cc { get; set; }

    }


    public partial class alliance : BaseDataModel<int>, IAllianceDbItem
    {

        public DateTime dateCreate { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int creatorId { get; set; }
        public string creatorName { get; set; }
        public int? dateDisband { get; set; }
        public string images { get; set; }
        public int pvpRating { get; set; }
        public bool disbandet { get; set; }
        public byte tax { get; set; }
        public int cc { get; set; }
    }



    #endregion

    #region AllianceFleet

    public interface IAllianceFleetDbItem : IUniqueIdElement, IDbPropertyAllianceId
    {
        int creatorId { get; set; }


        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string creatorName { get; set; }

        int fleetIdCreator { get; set; }

        string fleetIds { get; set; }
    }

    public partial class alliance_fleet : BaseDataModel<int>, IAllianceFleetDbItem
    {

        public int allianceId { get; set; }
        public int creatorId { get; set; }
        public string creatorName { get; set; }
        public int fleetIdCreator { get; set; }
        public string fleetIds { get; set; }
    }


    #endregion

    #region AllianceRequestMessage

    public interface IAllianceRequestMessageDbItem : IUniqueIdElement, IDbPropertyDateCreateInt
    {

        byte sourceType { get; set; }
        int fromId { get; set; }


        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string fromName { get; set; }
        int toId { get; set; }


        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string toName { get; set; }

        [MaxLength(1000)]
        string message { get; set; }
        bool userAccepted { get; set; }
        byte allianceAccepted { get; set; }
        [MaxLength(1000)]
        string creatorIcon { get; set; }
    }

    public partial class alliance_request_message : BaseDataModel<int>, IAllianceRequestMessageDbItem
    {

        public int dateCreate { get; set; }
        public byte sourceType { get; set; }
        public int fromId { get; set; }
        public string fromName { get; set; }
        public int toId { get; set; }
        public string toName { get; set; }
        public string message { get; set; }
        public bool userAccepted { get; set; }
        public byte allianceAccepted { get; set; }
        public string creatorIcon { get; set; }
    }



    #endregion

    #region AllianceRequestMessageHistory

    public interface IAllianceRequestMessageHistoryDbItem : IAllianceRequestMessageDbItem
    {
        int oldArmId { get; set; }
        int dateDelete { get; set; }
    }

    public partial class alliance_request_message_history : BaseDataModel<int>, IAllianceRequestMessageHistoryDbItem
    {

        public int dateCreate { get; set; }
        public byte sourceType { get; set; }
        public int fromId { get; set; }
        public string fromName { get; set; }
        public int toId { get; set; }
        public string toName { get; set; }
        public string message { get; set; }
        public bool userAccepted { get; set; }
        public byte allianceAccepted { get; set; }
        public string creatorIcon { get; set; }
        public int oldArmId { get; set; }
        public int dateDelete { get; set; }
    }



    #endregion

    #region AllianceRole

    public interface IAllianceRoleDbItem : IUniqueIdElement<byte>, IDbPropertyCustomName
    {
        bool editAllianceInfo { get; set; }
        bool messageRead { get; set; }
        bool messageSend { get; set; }
        bool showManage { get; set; }
        bool setTech { get; set; }
        bool canManagePermition { get; set; }
        bool acceptNewMembers { get; set; }
        bool deleteMembers { get; set; }
    }

    public partial class alliance_role : BaseDataModel<byte>, IAllianceRoleDbItem
    {

        public string name { get; set; }
        public bool editAllianceInfo { get; set; }
        public bool messageRead { get; set; }
        public bool messageSend { get; set; }
        public bool showManage { get; set; }
        public bool setTech { get; set; }
        public bool canManagePermition { get; set; }
        public bool acceptNewMembers { get; set; }
        public bool deleteMembers { get; set; }
    }


    #endregion

    #region AllianceTech

    public interface IAllianceTechDbItem : IUniqueIdElement
    {

        string techProgress { get; set; }
    }

    public partial class alliance_tech : BaseDataModel<int>, IAllianceTechDbItem
    {

        public string techProgress { get; set; }
    }



    #endregion

    #region AllianceUser

    public interface IAllianceUserDbItem : IUniqueIdElement, IDbPropertyAllianceId, IDbPropertyUserId,
        IDbPropertyDateCreateDT
    {
        byte roleId { get; set; }
    }

    public partial class alliance_user : BaseDataModel<int>, IAllianceUserDbItem
    {

        public int allianceId { get; set; }
        public int userId { get; set; }
        public DateTime dateCreate { get; set; }
        public byte roleId { get; set; }
    }



    #endregion

    #region AllianceUserHistory

    public interface IAllianceUserHistoryDbItem : IAllianceUserDbItem
    {
        int dateLeave { get; set; }
        bool leave { get; set; }
        bool disbandet { get; set; }
    }

    public partial class alliance_user_history : BaseDataModel<int>, IAllianceUserHistoryDbItem
    {

        public int allianceId { get; set; }
        public int userId { get; set; }
        public DateTime dateCreate { get; set; }
        public byte roleId { get; set; }
        public int dateLeave { get; set; }
        public bool leave { get; set; }
        public bool disbandet { get; set; }
    }



    #endregion

    #region BalanceCc

    public interface IBalanceCcDbItem : IUniqueIdElement
    {
        int quantity { get; set; }
        DateTime dateUpdate { get; set; }
    }

    public partial class user_balance_cc : BaseDataModel<int>, IBalanceCcDbItem
    {

        public int quantity { get; set; }
        public DateTime dateUpdate { get; set; }
    }


    #endregion

    #region Channel

    public interface IChannelDbItem : IUniqueIdElement, IDbPropertyDateCreateInt
    {
        byte channelType { get; set; }
        [MaxLength((int)MaxLenghtConsts.ChannelNameDbMax)]
        string channelName { get; set; }

        [MaxLength((int)MaxLenghtConsts.PasswordDbMax)]
        string password { get; set; }
        int creatorId { get; set; }
        string creatorName { get; set; }
        [MaxLength((int)MaxLenghtConsts.UserImagesDbMax)]
        string channelIcon { get; set; }

    }

    public partial class channel : BaseDataModel<int>, IChannelDbItem
    {

        public int dateCreate { get; set; }
        public byte channelType { get; set; }
        public string channelName { get; set; }
        public string password { get; set; }
        public int creatorId { get; set; }
        public string creatorName { get; set; }
        public string channelIcon { get; set; }
        private List<channel_connection> _channelConnection;

        public List<channel_connection> GetConnections()
        {
            return _channelConnection;
        }
        public void SetConnections(List<channel_connection> connections)
        {
            _channelConnection = connections;
        }

        public bool HasConnections()
        {
            return _channelConnection != null;
        }
    }





    #endregion

    #region IChannelConnection

    public interface IChannelConnectionDbItem : IUniqueIdElement<long>
    {
        int channelId { get; set; }
        byte channelType { get; set; }
        int userId { get; set; }
        [MaxLength((int)MaxLenghtConsts.PasswordDbMax)]
        string password { get; set; }

        bool messageRead { get; set; }
        bool messageSend { get; set; }
    }

    public partial class channel_connection : BaseDataModel<long>, IChannelConnectionDbItem
    {

        public int channelId { get; set; }
        public byte channelType { get; set; }
        public int userId { get; set; }
        public string password { get; set; }
        public bool messageRead { get; set; }
        public bool messageSend { get; set; }
        private channel _channel;

        public virtual   channel GetChannel()
        {
            return _channel;
        }
        public  void SetChannel(channel channel)
        {
            _channel = channel;
        }

        public  bool HasChannel()
        {
            return _channel != null;
        }
    }



    #endregion

    #region ChannelMessage

    public interface IChannelMessageDbItem : IUniqueIdElement<long>, IDbPropertyDateCreateInt
    {
        int channelId { get; set; }
        int userId { get; set; }

        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string userName { get; set; }

        [MaxLength((int)MaxLenghtConsts.UserImagesDbMax)]
        string userIcon { get; set; }
        [MaxLength((int)MaxLenghtConsts.ChannelMessage)]
        string message { get; set; }
    }

    public partial class channel_message : BaseDataModel<long>, IChannelMessageDbItem
    {

        public int dateCreate { get; set; }
        public int channelId { get; set; }
        public int userId { get; set; }
        public string userName { get; set; }
        public string userIcon { get; set; }
        public string message { get; set; }
    }



    #endregion

    #region Currency

    public interface ICurrencyDbItem : IUniqueIdElement
    {
        [MaxLength(5)]
        string code { get; set; }

        decimal course { get; set; }
    }

    public partial class currency : BaseDataModel<int>, ICurrencyDbItem
    {

        public string code { get; set; }
        public decimal course { get; set; }
    }


    #endregion

    #region GDetailMoon

    public interface IGDetailMoonDbItem : IUniqueIdElement, IDbPropertyCustomName, IDbPropertyDescription
    {
    }

    public partial class g_detail_moon : BaseDataModel<int>, IGDetailMoonDbItem
    {

        public string name { get; set; }
        public string description { get; set; }
    }



    #endregion

    #region GDetailPlanet

    public interface IGDetailPlanetDbItem : IUniqueIdElement, IDbPropertyCustomName, IDbPropertyUserId, IDbPropertyAllianceId, IDbPropertyDescription
    {
        byte moonCount { get; set; }

        DateTime lastActive { get; set; }
        byte dangerLevel { get; set; }
        string resources { get; set; }
        string hangar { get; set; }
        string buildSpaceShipyard { get; set; }
        string buildExtractionModule { get; set; }
        string buildEnergyConverter { get; set; }
        string buildStorage { get; set; }
        string turels { get; set; }
        string unitProgress { get; set; }
        string extractionProportin { get; set; }
        int lastUpgradeProductionTime { get; set; }
    }

    public partial class g_detail_planet : BaseDataModel<int>, IGDetailPlanetDbItem
    {

        public string name { get; set; }
        public int userId { get; set; }
        public int allianceId { get; set; }
        public string description { get; set; }
        public byte moonCount { get; set; }
        public DateTime lastActive { get; set; }
        public byte dangerLevel { get; set; }
        public string resources { get; set; }
        public string hangar { get; set; }
        public string buildSpaceShipyard { get; set; }
        public string buildExtractionModule { get; set; }
        public string buildEnergyConverter { get; set; }
        public string buildStorage { get; set; }
        public string turels { get; set; }
        public string unitProgress { get; set; }
        public string extractionProportin { get; set; }
        public int lastUpgradeProductionTime { get; set; }
    }


    #endregion

    #region GDetailSystem

    public interface IGDetailSystemDbItem : IUniqueIdElement, IDbPropertyDescription, IDbPropertyCustomName
    {
        byte typeId { get; set; }



        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string userName { get; set; }

        int allianceId { get; set; }
        double energyBonus { get; set; }
    }

    public partial class g_detail_system : BaseDataModel<int>, IGDetailSystemDbItem
    {

        public string description { get; set; }
        public string name { get; set; }
        public byte typeId { get; set; }
        public string userName { get; set; }
        public int allianceId { get; set; }
        public double energyBonus { get; set; }
    }



    #endregion

    #region GGalaxy

    public interface IGGalaxyDbItem : IUniqueIdElement<byte>, IDbPropertyPosition, IDbPropertyTranslate,
        IDbPropertyNativeName
    {
        byte typeId { get; set; }
        short textureTypeId { get; set; }
        bool opened { get; set; }
    }

    public partial class g_galaxy : BaseDataModel<byte>, IGGalaxyDbItem
    {

        public string position { get; set; }
        public string translate { get; set; }
        public string nativeName { get; set; }
        public byte typeId { get; set; }
        public short textureTypeId { get; set; }
        public bool opened { get; set; }
    }


    #endregion

    #region GGameType

    public interface IGGameTypeDbItem : IUniqueIdElement<byte>, IDbPropertyDescription
    {
        [MaxLength(50)]
        string type { get; set; }

        [MaxLength(50)]
        string subType { get; set; }
    }

    public partial class g_game_type : BaseDataModel<byte>, IGGameTypeDbItem
    {

        public string description { get; set; }
        public string type { get; set; }
        public string subType { get; set; }
    }



    #endregion

    // common geometry


    public interface IBaseGeometryDbItem<T> : IUniqueIdElement<T> where T : struct
    {
        [Required]
        byte typeId { get; set; }

        [Required]
        short textureTypeId { get; set; }
    }



    #region GGeometrMoon

    public interface IGGeometrMoonDbItem : IBaseGeometryDbItem<int>, IDbPropertyOrbitAngle, IDbPropertyAxisAngle,
        IDbPropertyColor, IDbMoonAdress
    {
        double radius { get; set; }
        double orbit { get; set; }
        byte orbitPosition { get; set; }
    }

    public partial class g_geometry_moon : BaseDataModel<int>, IGGeometrMoonDbItem
    {

        public byte typeId { get; set; }
        public short textureTypeId { get; set; }
        public string orbitAngle { get; set; }
        public string axisAngle { get; set; }
        public string color { get; set; }
        public byte galaxyId { get; set; }
        public short sectorId { get; set; }
        public int systemId { get; set; }
        public int planetId { get; set; }
        public double radius { get; set; }
        public double orbit { get; set; }
        public byte orbitPosition { get; set; }
    }



    #endregion

    #region GGeometryPlanet

    public interface IGGeometryPlanetDbItem : IBaseGeometryDbItem<int>, IDbPropertyOrbitAngle, IDbPropertyAxisAngle,
        IDbPropertyColor, IDbPlanetAdress
    {
        // int starId { get; set; }
        double radius { get; set; }
        int? ringTypeId { get; set; }
        double orbit { get; set; }
        byte systemPosition { get; set; }
        byte orbitPosition { get; set; }
    }

    public partial class g_geometry_planet : BaseDataModel<int>, IGGeometryPlanetDbItem
    {

        public byte typeId { get; set; }
        public short textureTypeId { get; set; }
        public string orbitAngle { get; set; }
        public string axisAngle { get; set; }
        public string color { get; set; }
        public byte galaxyId { get; set; }
        public short sectorId { get; set; }
        public int systemId { get; set; }
        public double radius { get; set; }
        public int? ringTypeId { get; set; }
        public double orbit { get; set; }
        public byte systemPosition { get; set; }
        public byte orbitPosition { get; set; }
    }



    #endregion

    #region GGeometryStar

    public interface IGGeometryStarDbItem : IBaseGeometryDbItem<int>
    {
        double radius { get; set; }
    }

    public partial class g_geometry_star : BaseDataModel<int>, IGGeometryStarDbItem
    {

        public byte typeId { get; set; }
        public short textureTypeId { get; set; }
        public double radius { get; set; }
    }



    #endregion

    #region GGeometrySystem

    public interface IGGeometrySystemDbItem : IUniqueIdElement
    {
        string planetoids { get; set; }
    }

    public partial class g_geometry_system : BaseDataModel<int>, IGGeometrySystemDbItem
    {

        public string planetoids { get; set; }
    }



    #endregion

    #region GSectors

    public interface IGSectorsDbItem : IBaseGeometryDbItem<short>, IDbPropertyNativeName, IDbPropertyTranslate, IDbPropertyPosition, IDbSectorAdress
    {
        bool opened { get; set; }
    }

    public partial class g_sectors : BaseDataModel<short>, IGSectorsDbItem
    {

        public byte typeId { get; set; }
        public short textureTypeId { get; set; }
        public string nativeName { get; set; }
        public string translate { get; set; }
        public string position { get; set; }
        public byte galaxyId { get; set; }
        public bool opened { get; set; }
    }


    #endregion

    #region GSystem

    public interface IGSystemDbItem : IUniqueIdElement, IDbPropertyPosition, IDbSectorAdress
    {
        short sectorId { get; set; }
    }

    public partial class g_system : BaseDataModel<int>, IGSystemDbItem
    {

        public string position { get; set; }
        public byte galaxyId { get; set; }
        public short sectorId { get; set; }
    }



    #endregion

    #region GTextureType

    public interface IGTextureTypeDbItem : IUniqueIdElement<short>
    {
        byte gameTypeId { get; set; }
    }

    public partial class g_texture_type : BaseDataModel<short>, IGTextureTypeDbItem
    {

        public byte gameTypeId { get; set; }
    }



    #endregion

    #region GUserBookmark

    public interface IGUserBookmarkDbItem : IUniqueIdElement, IDbPropertyUserId
    {
        int objectId { get; set; }
        byte typeId { get; set; }
    }

    public partial class user_bookmark : BaseDataModel<int>, IGUserBookmarkDbItem
    {

        public int userId { get; set; }
        public int objectId { get; set; }
        public byte typeId { get; set; }
    }



    #endregion

    #region JournalBuy

    public interface IJournalBuyDbItem : IUniqueIdElement
    {
        bool transactionType { get; set; }
        int transactionId { get; set; }
    }

    public partial class journal_buy : BaseDataModel<int>, IJournalBuyDbItem
    {

        public bool transactionType { get; set; }
        public int transactionId { get; set; }
    }



    #endregion

    #region Confederation
    #region Officer

    public interface IOfficerDbItem : IUniqueIdElement, IDbPropertyUserId
    {
        byte officerType { get; set; }
        int? allianceId { get; set; }
        bool elected { get; set; }
        int? appointedUserId { get; set; }
        int dateStart { get; set; }
        int dateEnd { get; set; }

    }

    public partial class c_officer : BaseDataModel<int>, IOfficerDbItem
    {

        public int userId { get; set; }
        public byte officerType { get; set; }
        public int? allianceId { get; set; }
        public bool elected { get; set; }
        public int? appointedUserId { get; set; }
        public int dateStart { get; set; }
        public int dateEnd { get; set; }
    }



    #endregion


    #region c_officer_candidat

    public interface IOfficerCandidatDbItem : IUniqueIdElement, IDbPropertyUserId
    {
        int dateCreate { get; set; }

        int voices { get; set; }
        bool isFinalizer { get; set; }

    }

    public partial class c_officer_candidat : BaseDataModel<int>, IOfficerCandidatDbItem
    {
        public int userId { get; set; }
        public int dateCreate { get; set; }
        public int voices { get; set; }
        public bool isFinalizer { get; set; }
    }

    #endregion

    #region c_vote
    public interface IVoteDbItem : IUniqueIdElement
    {
        int candidatUserId { get; set; }

        int voterUserId { get; set; }

    }
    public partial class c_vote : BaseDataModel<int>, IVoteDbItem
    {
        public int candidatUserId { get; set; }
        public int voterUserId { get; set; }
    }




    #endregion



    #endregion



    #region Premium

    public interface IPremiumDbItem : IUniqueIdElement
    {
        int endTime { get; set; }
        bool autopay { get; set; }
        bool finished { get; set; }
        string data { get; set; }
    }

    public partial class user_premium : BaseDataModel<int>, IPremiumDbItem
    {

        public int endTime { get; set; }
        public bool autopay { get; set; }
        public bool finished { get; set; }
        public string data { get; set; }
    }



    #endregion



    #region ProductStore

    public interface IProductStoreDbStore : IUniqueIdElement<short>, IDbPropertyProductTypeId
    {
        [MaxLength(5)]
        string currencyCode { get; set; }

        decimal cost { get; set; }
        bool trash { get; set; }
        DateTime date { get; set; }
        string property { get; set; }

    }

    public partial class product_store : BaseDataModel<short>, IProductStoreDbStore
    {

        public byte productTypeId { get; set; }
        public string currencyCode { get; set; }
        public decimal cost { get; set; }
        public bool trash { get; set; }
        public DateTime date { get; set; }
        public string property { get; set; }
    }



    #endregion

    #region ProductType

    public interface IProductTypeDbItem : IUniqueIdElement<byte>, IDbPropertyCustomName
    {
        string property { get; set; }
    }

    public partial class product_type : BaseDataModel<byte>, IProductTypeDbItem
    {

        public string name { get; set; }
        public string property { get; set; }
    }



    #endregion

    #region SysHelper

    public interface ISysHelperDbItem : IUniqueIdElement
    {
        [MaxLength(128)]
        string typeName { get; set; }

        string value { get; set; }
    }

    public partial class sys_helper : BaseDataModel<int>, ISysHelperDbItem
    {

        public string typeName { get; set; }
        public string value { get; set; }
    }


    #endregion



    //=======================================================================



    #region TransacationCc

    public interface ITransacationCcDbItem : IUniqueIdElement, IDbPropertyUserId, IDbPropertyDateCreateDT
    {
        short productStoreId { get; set; }
        int quantity { get; set; }
        short source { get; set; }
        decimal totalCost { get; set; }
        [MaxLength(22)]
        string token { get; set; }
        [MaxLength(256)]
        string formToken { get; set; }
    }

    public partial class transacation_cc : BaseDataModel<int>, ITransacationCcDbItem
    {

        public int userId { get; set; }
        public DateTime dateCreate { get; set; }
        public short productStoreId { get; set; }
        public int quantity { get; set; }
        public short source { get; set; }
        public decimal totalCost { get; set; }
        public string token { get; set; }
        public string formToken { get; set; }
    }


    #endregion

    //=======================================================================

    #region UMmotherJump

    public interface IUMmotherJumpDbItem : IUniqueIdElement
    {
        int motherId { get; set; }
        int startTime { get; set; }
        int endTime { get; set; }
        bool cancelJump { get; set; }
        bool completed { get; set; }
        int startSystem { get; set; }
        int targetSystem { get; set; }
    }

    public partial class user_mother_jump : BaseDataModel<int>, IUMmotherJumpDbItem
    {

        public int motherId { get; set; }
        public int startTime { get; set; }
        public int endTime { get; set; }
        public bool cancelJump { get; set; }
        public bool completed { get; set; }
        public int startSystem { get; set; }
        public int targetSystem { get; set; }
    }



    #endregion

    #region UReport

    public interface IUReportDbItem : IUniqueIdElement
    {
        int taskId { get; set; }
        string resources { get; set; }
        int battleTime { get; set; }
        string roundsLog { get; set; }
        int defenderUserId { get; set; }


        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string defenderUserName { get; set; }
        string atackerSummaryReport { get; set; }
        string defenderSummaryReport { get; set; }
        bool atackerDeleteReport { get; set; }
        int atackerUserId { get; set; }
        bool defenderDeleteReport { get; set; }
        bool atackerWin { get; set; }
        bool atackerIsSkagry { get; set; }

        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string atackerUserName { get; set; }

        byte atackerResultStatus { get; set; }
    }

    public partial class user_report : BaseDataModel<int>, IUReportDbItem
    {

        public int taskId { get; set; }
        public string resources { get; set; }
        public int battleTime { get; set; }
        public string roundsLog { get; set; }
        public int defenderUserId { get; set; }
        public string defenderUserName { get; set; }
        public string atackerSummaryReport { get; set; }
        public string defenderSummaryReport { get; set; }
        public bool atackerDeleteReport { get; set; }
        public int atackerUserId { get; set; }
        public bool defenderDeleteReport { get; set; }
        public bool atackerWin { get; set; }
        public bool atackerIsSkagry { get; set; }
        public string atackerUserName { get; set; }
        public byte atackerResultStatus { get; set; }
    }



    #endregion

    #region USpy

    public interface IUSpyDbItem : IUniqueIdElement
    {
        int sourceUserId { get; set; }
        int targetPlanetId { get; set; }
        byte targetPlanetTypeId { get; set; }

        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string targetPlanetName { get; set; }

        string targetPlanetHangar { get; set; }
        string targetResource { get; set; }

        [MaxLength(100)] //todo url or UserImage?
        string targetUserImage { get; set; }
        [MaxLength((int)MaxLenghtConsts.UserImagesDbMax)]
        string targetUserName { get; set; }
        int dateActivate { get; set; }
    }

    public partial class user_spy : BaseDataModel<int>, IUSpyDbItem
    {

        public int sourceUserId { get; set; }
        public int targetPlanetId { get; set; }
        public byte targetPlanetTypeId { get; set; }
        public string targetPlanetName { get; set; }
        public string targetPlanetHangar { get; set; }
        public string targetResource { get; set; }
        public string targetUserImage { get; set; }
        public string targetUserName { get; set; }
        public int dateActivate { get; set; }
    }


    #endregion

    #region UTask

    public interface IUTaskDbItem : IUniqueIdElement
    {
        string sourceSystemName { get; set; }
        int sourceUserId { get; set; }
        int sourceOwnId { get; set; }
        bool sourceOwnType { get; set; } //mother or planet
        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string sourceOwnName { get; set; }

        byte sourceTypeId { get; set; }
        string sourceFleet { get; set; }
        bool? isTransfer { get; set; }
        bool? isAtack { get; set; }
        int dateActivate { get; set; }
        int duration { get; set; }
        bool? canselation { get; set; }

        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string targetSystemName { get; set; }

        int targetPlanetId { get; set; }
        byte targetPlanetTypeId { get; set; }

        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string targetPlanetName { get; set; }

        bool taskEnd { get; set; }
    }

    public partial class user_task : BaseDataModel<int>, IUTaskDbItem
    {

        public string sourceSystemName { get; set; }
        public int sourceUserId { get; set; }
        public int sourceOwnId { get; set; }
        public bool sourceOwnType { get; set; }
        public string sourceOwnName { get; set; }
        public byte sourceTypeId { get; set; }
        public string sourceFleet { get; set; }
        public bool? isTransfer { get; set; }
        public bool? isAtack { get; set; }
        public int dateActivate { get; set; }
        public int duration { get; set; }
        public bool? canselation { get; set; }
        public string targetSystemName { get; set; }
        public int targetPlanetId { get; set; }
        public byte targetPlanetTypeId { get; set; }
        public string targetPlanetName { get; set; }
        public bool taskEnd { get; set; }
    }



    #endregion

    #region User

    public interface IUserDbItem : IUniqueIdElement, IDbPropertyDateCreateDT
    {
        string authId { get; set; }
        [MaxLength((int)MaxLenghtConsts.UniqueName)]
        string nickname { get; set; }
        byte status { get; set; }
        int pvpPoint { get; set; }
        int leaveAllianceTime { get; set; }
        bool isNpc { get; set; }
        bool isOnline { get; set; }
        int dateLastLeft { get; set; } // in game
        int dateLastJoin { get; set; } // out from game
        string avatarUrls { get; set; }
        string description { get; set; }
        string meedsQuantity { get; set; }
    }

    public partial class user : BaseDataModel<int>, IUserDbItem
    {

        public DateTime dateCreate { get; set; }
        [Key]
        public string authId { get; set; }
        [Key]
        public string nickname { get; set; }
        public byte status { get; set; }
        public int pvpPoint { get; set; }
        public int leaveAllianceTime { get; set; }
        public bool isNpc { get; set; }
        public bool isOnline { get; set; }
        public int dateLastLeft { get; set; }
        public int dateLastJoin { get; set; }
        public string avatarUrls { get; set; }
        public string description { get; set; }
        public string meedsQuantity { get; set; }
    }



    #endregion

    #region UserChest

    public interface IUserChestDbStore : IUniqueIdElement, IDbPropertyProductStoreId, IDbPropertyProductTypeId,
        IDbPropertyUserId, IDbPropertyDateCreateInt
    {
        int transactionsgId { get; set; }
        bool activated { get; set; }
        bool finished { get; set; }
        int? dateActivate { get; set; }
    }

    public partial class user_chest : BaseDataModel<int>, IUserChestDbStore
    {

        public short productStoreId { get; set; }
        public byte productTypeId { get; set; }
        public int userId { get; set; }
        public int dateCreate { get; set; }
        public int transactionsgId { get; set; }
        public bool activated { get; set; }
        public bool finished { get; set; }
        public int? dateActivate { get; set; }
    }



    #endregion

    #region UserMothership

    public interface IUserMothershipDbItem : IUniqueIdElement
    {
        int startSystemId { get; set; }
        string resources { get; set; }
        string hangar { get; set; }
        string unitProgress { get; set; }
        string laboratoryProgress { get; set; }
        string extractionProportin { get; set; }
        string techProgress { get; set; }
        int lastUpgradeProductionTime { get; set; }
    }

    public partial class user_mothership : BaseDataModel<int>, IUserMothershipDbItem
    {

        public int startSystemId { get; set; }
        public string resources { get; set; }
        public string hangar { get; set; }
        public string unitProgress { get; set; }
        public string laboratoryProgress { get; set; }
        public string extractionProportin { get; set; }
        public string techProgress { get; set; }
        public int lastUpgradeProductionTime { get; set; }
    }



    #endregion




    #endregion

    // ReSharper restore InconsistentNaming

    #endregion
}