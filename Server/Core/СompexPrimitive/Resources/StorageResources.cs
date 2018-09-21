using System;
using System.Collections.Generic;
using Server.Core.StaticData;
using Server.Extensions;

namespace Server.Core.СompexPrimitive.Resources
{
    public interface IStorageResources
    {
        void InitializeField();
        bool IsFull();
        StorageResources SetStorageResource(MaterialResource current, MaterialResource max);
    }

    public class StorageResources : IStorageResources, IEquatable<StorageResources>
    {
        public static string MaxKey { get; } = nameof(Max);
        public static string CurrentKey { get; } = nameof(Current);
        public MaterialResource Max { get; set; }
        public MaterialResource Current { get; set; }

        public void InitializeField()
        {
            Current = new MaterialResource();
            Max = new MaterialResource();
        }

        public bool IsFull()
        {
            return (Current.E >= Max.E
                    || Current.Ir >= Max.Ir
                    || Current.Dm >= Max.Dm);
        }


        public StorageResources SetStorageResource(MaterialResource current, MaterialResource max)
        {
            Current = Current.SetResource(current);
            Max = Max.SetResource(max);
            return this;
        }

        public bool NeedFix()
        {
            return (Current.E > Max.E
                    || Current.Ir > Max.Ir
                    || Current.Dm > Max.Dm);
        }

        public bool AllFull()
        {
            return (Math.Abs(Current.E - Max.E) < 1
                    || Math.Abs(Current.Ir - Max.Ir) < 1
                    || Math.Abs(Current.Dm - Max.Dm) < 1);
        }

        public static StorageResources InitMotherResources()
        {
            var max = MaterialResource.MaxMotherResourses();
            var cur = MaterialResource.InitStartResourses(max);

            return new StorageResources
            {
                Current = cur,
                Max = max.Multiply(0.5)
            };
        }

        public static StorageResources InitPlanetResources()
        {
            var max = MaterialResource.StoreDefaultMaxStorable();
            var cur = MaterialResource.InitStartResourses(max);

            return new StorageResources
            {
                Current = cur,
                Max = max
            };
        }

        public static StorageResources StorageProportion(string dbProportion)
        {
            return new StorageResources
            {
                Current = dbProportion.ToSpecificModel<MaterialResource>()
            };
        }

        public static StorageResources StorageProportion(MaterialResource dbProportion)
        {
            return new StorageResources
            {
                Current = dbProportion
            };
        }

        public static void CalculateProductionResources(StorageResources currentResources,
            MaterialResource productionProportion,
            ref int lastUpgradeTime,
            int buildExtractionLevel,
            bool isActivePremium,
            double baseIr,
            double baseDm,
            Func<int, bool, double> getPower,
            Action<StorageResources> fixCurrentResourcesFactory)
        {
            var curTime = UnixTime.UtcNow();
            if (lastUpgradeTime == 0 || curTime == lastUpgradeTime || currentResources.AllFull())
            {
                lastUpgradeTime = curTime;
                return;
            }
            var deltaTime = curTime - lastUpgradeTime;
            if (deltaTime < 0) throw new Exception(Error.ServerTimeIsWrong);

            //11147
            var power = getPower(buildExtractionLevel, isActivePremium);//ExtractionModule.GetPower(buildExtractionLevel, isActivePremium);
            var pdoucedResource = ExtractionResource.CalculateExtractionBySeconds(productionProportion, power, deltaTime, baseIr, baseDm);

            currentResources.Current = MaterialResource.GetSummResource(currentResources.Current, pdoucedResource);

            if (currentResources.NeedFix()) fixCurrentResourcesFactory(currentResources);// StorageResourcesService.FixCurrentResources(res)
            lastUpgradeTime = curTime;
        }

        public Dictionary<string, Dictionary<string, double>> ToDictionary()
        {
            return ToDictionary(this);
        }

        public static Dictionary<string, Dictionary<string, double>> ToDictionary(StorageResources resources)
        {
            return new Dictionary<string, Dictionary<string, double>>
            {
                {MaxKey, resources.Max.ToDictionary()},
                {CurrentKey, resources.Current.ToDictionary()}
            };
        }

        public static StorageResources DictionaryToStorageResources(Dictionary<string, Dictionary<string, double>> res)
        {
            return new StorageResources
            {
                Current = MaterialResource.DictionaryToMaterialResource(res[CurrentKey]),
                Max = MaterialResource.DictionaryToMaterialResource(res[MaxKey])
            };
        }

        public static Dictionary<string, double> GetCurrent(Dictionary<string, Dictionary<string, double>> res)
        {
            return res[CurrentKey];
        }

        public static Dictionary<string, double> GetMax(Dictionary<string, Dictionary<string, double>> res)
        {
            return res[MaxKey];
        }

        #region IEquatable

        public bool Equals(StorageResources other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Equals(Max, other.Max) && Equals(Current, other.Current);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((StorageResources)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return ((Max != null ? Max.GetHashCode() : 0) * 397) ^ (Current != null ? Current.GetHashCode() : 0);
            }
        }

        public static bool operator ==(StorageResources left, StorageResources right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(StorageResources left, StorageResources right)
        {
            return !Equals(left, right);
        }

        #endregion
    }
    public class StorageResourceItem
    {
        public double Max { get; set; }
        public double Current { get; set; }

        public static StorageResourceItem GetItemByName(StorageResources resources, string name)
        {
            var cur = resources.Current.ToDictionary();
            var max = resources.Max.ToDictionary();
            return new StorageResourceItem
            {
                Current = Convert.ToDouble(cur[name]),
                Max = Convert.ToDouble(max[name])
            };
        }

        public static StorageResourceItem GetItemByName(Dictionary<string, double> current,
            Dictionary<string, double> max, string name)
        {
            return new StorageResourceItem
            {
                Current = Convert.ToDouble(current[name]),
                Max = Convert.ToDouble(max[name])
            };
        }
    }
}