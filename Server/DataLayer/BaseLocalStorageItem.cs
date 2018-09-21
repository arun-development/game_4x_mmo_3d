using System;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;

namespace Server.DataLayer
{
    public abstract class BaseLocalStorageItem<TModel, TPrimaryKeyType> where TModel : IDataModel<TPrimaryKeyType> where TPrimaryKeyType : struct
    {
        public virtual TPrimaryKeyType Id { get; set; }
        public long LastUpgrade;
        public bool Updated;
        public bool InProgressUpdate;
        public TModel ItemData;

        public void Update(TModel itemData)
        {
            if (itemData == null) throw new NullReferenceException(Error.NoData);
            if (!Equals(itemData.Id, Id)) new ArgumentException(Error.NotEquals, nameof(itemData.Id));

            LastUpgrade = UnixTime.UtcNowMs();
            InProgressUpdate = false;
            Updated = true;
            ItemData = itemData;
        }

        public void Init(TModel itemData)
        {
            if (itemData == null) throw new NullReferenceException(Error.NoData);
            if (Equals(itemData.Id, default(TPrimaryKeyType)))
                throw new ArgumentException(Error.NoData, nameof(itemData.Id));
            Id = itemData.Id;
            LastUpgrade = UnixTime.UtcNowMs();
            InProgressUpdate = false;
            Updated = true;
            ItemData = itemData;
        }
    }

    #region Alliance LocalStorageItems

    public class AllianceLocalStorageItem : BaseLocalStorageItem<AllianceDataModel, int>
    {
    }

    public class AllianceFleetLocalStorageItem : BaseLocalStorageItem<AllianceFleetDataModel, int>
    {
    }

    public class AllianceRequestMessageLocalStorageItem : BaseLocalStorageItem<AllianceRequestMessageDataModel, int>
    {
    }

    public class AllianceRoleLocalStorageItem : BaseLocalStorageItem<AllianceRoleDataModel, byte>
    {
    }

    public class AllianceTechLocalStorageItem : BaseLocalStorageItem<AllianceTechDataModel, int>
    {
    }

    public class AllianceUserLocalStorageItem : BaseLocalStorageItem<AllianceUserDataModel, int>
    {
    }

    #endregion

    #region Channel LocalStorageItems



    public class ChannelLocalStorageItem : BaseLocalStorageItem<ChannelDataModel, int>
    {
    }

    public class ChannelConnectiontLocalStorageItem : BaseLocalStorageItem<ChannelConnectionDataModel, long>
    {
    }
    public class ChannelMessageLocalStorageItem : BaseLocalStorageItem<ChannelMessageDataModel, long>
    {
    }

    #endregion

    #region World LocalStorageItems

    public class GDetailMoonLocalStorageItem : BaseLocalStorageItem<GDetailMoonDataModel, int>
    {
    }

    public class GDetailPlanetLocalStorageItem : BaseLocalStorageItem<GDetailPlanetDataModel, int>
    {
    }

    public class GDetailSystemLocalStorageItem : BaseLocalStorageItem<GDetailSystemDataModel, int>
    {
    }

    public class GGalaxyLocalStorageItem : BaseLocalStorageItem<GGalaxyDataModel, byte>
    {
    }

    public class GGameTypeLocalStorageItem : BaseLocalStorageItem<GGameTypeDataModel, byte>
    {
    }

    public class GGeometryMoonLocalStorageItem : BaseLocalStorageItem<GGeometryMoonDataModel, int>
    {
    }

    public class GGeometryPlanetLocalStorageItem : BaseLocalStorageItem<GGeometryPlanetDataModel, int>
    {
    }

    public class GGeometryStarLocalStorageItem : BaseLocalStorageItem<GGeometryStarDataModel, int>
    {
    }

    public class GGeometrySystemLocalStorageItem : BaseLocalStorageItem<GGeometrySystemDataModel, int>
    {
    }

    public class GSectorsLocalStorageItem : BaseLocalStorageItem<GSectorsDataModel, short>
    {
    }

    public class GSystemLocalStorageItem : BaseLocalStorageItem<GSystemDataModel, int>
    {
    }

    public class GTextureTypeLocalStorageItem : BaseLocalStorageItem<GTextureTypeDataModel, short>
    {
    }

    public class SysHelperLocalStorageItem : BaseLocalStorageItem<SysHelperDataModel, int>
    {
    }

    #endregion

    #region Store DataModels

    public class CurrencyLocalStorageItem : BaseLocalStorageItem<CurrencyDataModel, int>
    {
    }

    public class ProductStoreLocalStorageItem : BaseLocalStorageItem<ProductStoreDataModel, short>
    {
    }


    public class ProductTypeLocalStorageItem : BaseLocalStorageItem<ProductTypeDataModel, byte>
    {
    }

    #endregion

    #region User DataModels

    public class BalanceCcLocalStorageItem : BaseLocalStorageItem<UserBalanceCcDataModel, int>
    {
    }

    public class GUserBookmarkLocalStorageItem : BaseLocalStorageItem<UserBookmarkDataModel, int>
    {
    }

    public class JournalBuyLocalStorageItem : BaseLocalStorageItem<JournalBuyDataModel, int>
    {
    }

    public class PremiumLocalStorageItem : BaseLocalStorageItem<UserPremiumDataModel, int>
    {
    }

    public class TransicationCcLocalStorageItem : BaseLocalStorageItem<TransacationCcDataModel, int>
    {
    }

    public class UMotherJumpLocalStorageItem : BaseLocalStorageItem<UserMotherJumpDataModel, int>
    {
    }

    public class UReportLocalStorageItem : BaseLocalStorageItem<UserReportDataModel, int>
    {
    }

    public class UserChestLocalStorageItem : BaseLocalStorageItem<UserChestDataModel, int>
    {
    }

    public class UserLocalStorageItem : BaseLocalStorageItem<UserDataModel, int>
    {
    }

    public class UserMothershipLocalStorageItem : BaseLocalStorageItem<UserMothershipDataModel, int>
    {
    }

 

 

    public class USpyLocalStorageItem : BaseLocalStorageItem<UserSpyDataModel, int>
    {
    }

    public class UTaskLocalStorageItem : BaseLocalStorageItem<UserTaskDataModel, int>
    {
    }

    #endregion
}