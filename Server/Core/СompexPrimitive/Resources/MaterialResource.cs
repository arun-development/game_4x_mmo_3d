using System;
using System.Collections.Generic;
using Server.Extensions;


namespace Server.Core.СompexPrimitive.Resources
{
    public class MaterialResource : ICloneable, IEquatable<MaterialResource>
    {
        public double E;
        public double Ir;
        public double Dm;



        public object Clone()
        {
            return MemberwiseClone();
        }

        public MaterialResource()
        {
        }
        public MaterialResource(MaterialResource other)
        {
            Init(other.E, other.Ir, other.Dm);
        }
        public MaterialResource(double? e = null, double? ir = null, double? dm = null)
        {
            Init(e, ir, dm);
        }

        public MaterialResource Init(double? e = null, double? ir = null, double? dm = null)
        {
            if (e != null) E = (double)e;
            if (ir != null) Ir = (double)ir;
            if (dm != null) Dm = (double)dm;
            return this;
        }

        public MaterialResource SetResource(MaterialResource res)
        {
            Init(res.E, res.Ir, res.Dm);
            return this;
        }
        public MaterialResource Multiply(double multiple)
        {
            E *= multiple;
            Ir *= multiple;
            Dm *= multiple;
            return this;
        }
        public MaterialResource Multiply(MaterialResource multiple)
        {
            E *= multiple.E;
            Ir *= multiple.Ir;
            Dm *= multiple.Dm;
            return this;
        }
        public MaterialResource Sum(MaterialResource other)
        {
            E += other.E;
            Ir += other.Ir;
            Dm += other.Dm;
            return this;
        }

        public MaterialResource ConvertToInt()
        {
            E = Math.Floor(E);


            Ir = Math.Floor(Ir);


            Dm = Math.Floor(Dm);

            return this;
        }


        public Dictionary<string, double> ToDictionary()
        {
            return ToDictionary(this);
        }

        public static Dictionary<string, double> ToDictionary(MaterialResource resources)
        {
            return new Dictionary<string, double>
            {
                {ResourcesNativeName.E, resources.E},
                {ResourcesNativeName.Ir, resources.Ir},
                {ResourcesNativeName.Dm, resources.Dm},
            };
        }

        public static MaterialResource DictionaryToMaterialResource(Dictionary<string, double> resources)
        {
            return new MaterialResource().Init(resources[ResourcesNativeName.E], resources[ResourcesNativeName.Ir],
                resources[ResourcesNativeName.Dm]);
        }

        public static MaterialResource FixCurrentResources(MaterialResource currResources, MaterialResource max)
        {
            if (currResources.E > max.E) currResources.E = max.E;

            if (currResources.Ir > max.Ir) currResources.Ir = max.Ir;

            if (currResources.Dm > max.Dm) currResources.Dm = max.Dm;
            //return resourses;
            return currResources;
        }


        public static MaterialResource InitStartResourses(MaterialResource maxRes = null)
        {
            var q = maxRes ?? StoreDefaultMaxStorable();
            return new MaterialResource
            {
                E = q.E / 10,
                Dm = q.Ir / 10,
                Ir = q.Dm / 10
            }.ConvertToInt();
        }

        public static MaterialResource StoreDefaultMaxStorable()
        {
            return new MaterialResource
            {
                E = 20000,
                Ir = 15000,
                Dm = 5000
            };
        }

        public static MaterialResource MaxMotherResourses()
        {
            return new MaterialResource
            {
                E = 1e6,
                Ir = 1e6,
                Dm = 1e6
            };
        }

        public static MaterialResource ConvertStorageToMaterial(string storageResourses)
        {
            return ConvertStorageToMaterial(storageResourses.ToSpecificModel<StorageResources>());
        }

        public static MaterialResource ConvertStorageToMaterial(StorageResources storageResourses)
        {
            return storageResourses.Current;
        }

        public static MaterialResource ConvertBasePriceToMaterial(BasePrice bp)
        {
            return new MaterialResource
            {
                Dm = bp.Dm,
                E = bp.E,
                Ir = bp.Ir
            };
        }


        public static bool EnoughResourses(MaterialResource currentResourses, MaterialResource price)
        {
            if (currentResourses.E < price.E) return false;
            if (currentResourses.Dm < price.Dm) return false;
            if (currentResourses.Ir < price.Ir) return false;
            return true;
        }


        public static MaterialResource CalcUnitsPrice(BasePrice defaultPrice, int count)
        {
            return new MaterialResource
            {
                E = defaultPrice.E * count,
                Ir = defaultPrice.Ir * count,
                Dm = defaultPrice.Dm * count
            };
        }


        public static MaterialResource CalcNewResourses(MaterialResource curentResourses, MaterialResource other, bool isSum)
        {
            var operation = isSum ? 1 : -1;
            return new MaterialResource
            {
                E = curentResourses.E + (operation * other.E),
                Ir = curentResourses.Ir + (operation * other.Ir),
                Dm = curentResourses.Dm + (operation * other.Dm)
            };
        }


        public static MaterialResource CalcNewResoursesFromBuy(MaterialResource curentResourses, MaterialResource price)
        {
            return CalcNewResourses(curentResourses, price, false);
        }

        public static MaterialResource GetSummResource(MaterialResource curentResourses, MaterialResource other)
        {
            return CalcNewResourses(curentResourses, other, true);
        }

        public static MaterialResource InitBaseOwnProportion()
        {
            return new MaterialResource
            {
                E = 50.0,
                Dm = 25.0,
                Ir = 25.0
            };
        }

        #region IEquatable

        public bool Equals(MaterialResource other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return E.Equals(other.E) && Dm.Equals(other.Dm) && Ir.Equals(other.Ir);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((MaterialResource)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = E.GetHashCode();
                hashCode = (hashCode * 397) ^ Dm.GetHashCode();
                hashCode = (hashCode * 397) ^ Ir.GetHashCode();
                return hashCode;
            }
        }

        public static bool operator ==(MaterialResource left, MaterialResource right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(MaterialResource left, MaterialResource right)
        {
            return !Equals(left, right);
        }

        #endregion
    }
}