using System;
using System.Data;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;

namespace Server.Services.GameObjects.BuildModel
{
    public interface IBuildUpgrade : INativeName
    {
        BuildUpgrade SetData(StorageResources storageResourses, ItemProgress progress, string nativeName);
        bool IsUpgradeComplite(ItemProgress progress);
        int GetLevel();
    }

    public class BuildUpgrade : IBuildUpgrade, IEquatable<BuildUpgrade>
    {
        public StorageResources StorageResources { get; set; }
        public ItemProgress Progress { get; set; }
        public int Cc { get; set; }
        public string NativeName { get; set; }


        public BuildUpgrade()
        {
        }

        public BuildUpgrade(StorageResources storageResourses, ItemProgress progress, string nativeName)
        {
            SetData(storageResourses, progress, nativeName);
        }



        public BuildUpgrade SetData(StorageResources storageResourses, ItemProgress progress, string nativeName)
        {
            StorageResources = storageResourses;
            Progress = progress;
            NativeName = nativeName;
            return this;
        }


        public bool IsUpgradeComplite(ItemProgress progress)
        {
            if (progress.IsNullOrFalse()) return false;

            return (progress.StartTime + progress.Duration - UnixTime.UtcNow() <= 0);
        }

        public int GetLevel()
        {
            return Progress.GetLevel(1);
        }


        public BuildUpgrade SetData(ItemProgress progress, string nativeName)
        {
            Progress = progress;
            NativeName = nativeName;
            return this;
        }


        public static BuildUpgrade SetUpgrade(BuildUpgrade bu, GameResource currentCost)
        {
            var curRes = bu.StorageResources.Current;

            var enoughtRes = MaterialResource.EnoughResourses(curRes, currentCost);
            if (!enoughtRes)
            {
                return bu;
            }

            var newResourse = MaterialResource.CalcNewResoursesFromBuy(curRes, currentCost);

            var upgradedData = new BuildUpgrade
            {
                StorageResources =
                    bu.StorageResources.SetStorageResource(newResourse, bu.StorageResources.Max),
                Progress = new ItemProgress
                {
                    Level = bu.Progress.Level,
                    IsProgress = true,
                    Duration = currentCost.TimeProduction
                },
                NativeName = bu.NativeName
            };


            return upgradedData;
        }


        public static void TransactionBuildUpdate(IDbConnection connection, GDetailPlanetDataModel p, BuildUpgrade buildUpgrade, IServiceProvider resolver, UserBalanceCcDataModel ccDataModel = null)
        {
            var planetService = resolver.GetService<IGDetailPlanetService>();
            if (p == null) throw new Exception(Error.NoData);
            if (ccDataModel != null)
            {
                var storeService = resolver.GetService<IStoreService>();
                ccDataModel.Quantity = buildUpgrade.Cc;
                storeService.AddOrUpdateBalance(connection, ccDataModel);
            }

            if (buildUpgrade.StorageResources != null) p.Resources = buildUpgrade.StorageResources;

            BuildNativeNames buildType;
            Enum.TryParse(buildUpgrade.NativeName, out buildType);

            if (buildType == BuildNativeNames.Storage)
                p.BuildStorage = buildUpgrade.Progress;
            else if (buildType == BuildNativeNames.Turel)
                p.Turels = buildUpgrade.Progress;
            else if (buildType == BuildNativeNames.SpaceShipyard)
                p.BuildSpaceShipyard = buildUpgrade.Progress;
            else if (buildType == BuildNativeNames.EnergyConverter)
                p.BuildEnergyConverter = buildUpgrade.Progress;
            else if (buildType == BuildNativeNames.ExtractionModule)
                p.BuildExtractionModule = buildUpgrade.Progress;
            planetService.AddOrUpdate(connection,p);
        }

        #region IEquatable

        public bool Equals(BuildUpgrade other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Equals(StorageResources, other.StorageResources) && Equals(Progress, other.Progress) &&
                   string.Equals(NativeName, other.NativeName, StringComparison.InvariantCulture) && Cc == other.Cc;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((BuildUpgrade)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = (StorageResources != null ? StorageResources.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ (Progress != null ? Progress.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^
                           (NativeName != null ? StringComparer.InvariantCulture.GetHashCode(NativeName) : 0);
                hashCode = (hashCode * 397) ^ Cc;
                return hashCode;
            }
        }

        public static bool operator ==(BuildUpgrade left, BuildUpgrade right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(BuildUpgrade left, BuildUpgrade right)
        {
            return !Equals(left, right);
        }

        #endregion
    }
}