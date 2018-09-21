using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.Interfaces.GameObjects;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Products;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.Modules.Localize;
 

namespace Server.Core.Tech
{

    public enum TechType : byte
    {
        TechDrone = UnitType.Drone,
        TechFrigate = UnitType.Frigate,
        TechBattlecruiser = UnitType.Battlecruiser,
        TechBattleship = UnitType.Battleship,
        TechDrednout = UnitType.Drednout,
        TechWeaponUpgrade = 6,
        TechDamageControl = 7
    }

    public enum TechPropertyKeys : byte
    {
        Level = 1,
        Atack = 2,
        Hp = 3
    }

    public class BuildItemTechData
    {
        public bool IsTech { get; } = true;

        public Dictionary<TechPropertyKeys, BuildPropertyView> Properties;

        public BuildItemTechData()
        {
        }
        public BuildItemTechData(Dictionary<TechPropertyKeys, BuildPropertyView> props)
        {
            Properties = props;
        }
    }

    public interface ITech
    {
        TechType TechType { get; set; }
        ItemProgress Progress { get; set; }
        Dictionary<TechType, int> Conditions { get; set; }
        bool Disabled { get; set; }
    }

    public class TechOut : ITech, INativeName
    {
        private TechType _techType;
        public TechType TechType
        {
            get
            {
                return _techType;
            }
            set
            {
                _techType = value;
                NativeName = _techType.ToString();
            }
        }
        public string NativeName { get; set; }
        public ItemProgress Progress { get; set; }
        public Dictionary<TechType, int> Conditions { get; set; }
        public bool Disabled { get; set; }
        public LangField Text;
        public BasePrice BasePrice;
        public SpriteImages SpriteImages;

        private bool _priceCalculated = false;

        public void CalcResultPrice(bool hasPremium)
        {
            if (_priceCalculated) return;
            _priceCalculated = true;
            if (Disabled) return;
            Progress.Level = Progress.GetLevel();
            if (Progress.Level == 0) return;
            BasePrice.TimeProduction *= (int)Progress.Level;
            BasePrice.Cc *= (int)Progress.Level;
        }


    }



    public class BattleTeches
    {

        private Dictionary<TechType, Tech> _teches;
        private WeaponUpgradeTech _weaponUpgrade => (WeaponUpgradeTech)_teches[TechType.TechWeaponUpgrade];
        private DamageControlTech _damageControl => (DamageControlTech)_teches[TechType.TechDamageControl];
        public readonly List<TechType> ProfiTechTypes = new List<TechType> {
            TechType.TechDrone,
            TechType.TechFrigate,
            TechType.TechBattlecruiser,
            TechType.TechBattleship,
            TechType.TechDrednout
        };
        public readonly List<TechType> BaseTechTypes = new List<TechType> {
            TechType.TechWeaponUpgrade,
            TechType.TechDamageControl,
        };

        private readonly List<TechType> _orderedTechesType = new List<TechType>
        {
            TechType.TechWeaponUpgrade,
            TechType.TechDamageControl,
            TechType.TechDrone,
            TechType.TechFrigate,
            TechType.TechBattlecruiser,
            TechType.TechBattleship,
            TechType.TechDrednout
        };



        public BattleTeches()
        {
        }
        public BattleTeches(Dictionary<TechType, ItemProgress> dbTeches)
        {
            _setTeches(dbTeches);
        }

        private void _setTeches(Dictionary<TechType, ItemProgress> dbTeches)
        {

            _teches = new Dictionary<TechType, Tech>
            {
                {TechType.TechWeaponUpgrade, new WeaponUpgradeTech(dbTeches[TechType.TechWeaponUpgrade])},
                {TechType.TechDamageControl, new DamageControlTech(dbTeches[TechType.TechDamageControl])}
            };

            var baseTechLevels = GetBaseTechLevels();
            _teches.Add(TechType.TechDrone, new DroneProfileTech(dbTeches[TechType.TechDrone], baseTechLevels));
            _teches.Add(TechType.TechFrigate, new FrigateProfileTech(dbTeches[TechType.TechFrigate], baseTechLevels));
            _teches.Add(TechType.TechBattlecruiser, new BattlecruiserProfileTech(dbTeches[TechType.TechBattlecruiser], baseTechLevels));
            _teches.Add(TechType.TechBattleship, new BattleshipProfileTech(dbTeches[TechType.TechBattleship], baseTechLevels));
            _teches.Add(TechType.TechDrednout, new DrednoutProfileTech(dbTeches[TechType.TechDrednout], baseTechLevels));
        }

        public void CreateStartTeches()
        {
            _teches = new Dictionary<TechType, Tech>
            {
                {TechType.TechWeaponUpgrade, new WeaponUpgradeTech()},
                {TechType.TechDamageControl, new DamageControlTech()}
            };

            var baseTechlevels = GetBaseTechLevels();
            _teches.Add(TechType.TechDrone, new DroneProfileTech(new ItemProgress(0), baseTechlevels));
            _teches.Add(TechType.TechFrigate, new FrigateProfileTech(new ItemProgress(0), baseTechlevels));
            _teches.Add(TechType.TechBattlecruiser, new BattlecruiserProfileTech(new ItemProgress(0), baseTechlevels));
            _teches.Add(TechType.TechBattleship, new BattleshipProfileTech(new ItemProgress(0), baseTechlevels));
            _teches.Add(TechType.TechDrednout, new DrednoutProfileTech(new ItemProgress(0), baseTechlevels));

        }

        public Dictionary<TechType, int> GetBaseTechLevels()
        {
            var wu = _weaponUpgrade;
            var dc = _damageControl;

            var baseTeches = new Dictionary<TechType, int>
            {
                {wu.TechType, wu.Progress.GetLevel()},
                { dc.TechType, dc.Progress.GetLevel()}
            };
            return baseTeches;
        }

        public Dictionary<TechType, TechOut> ConvertToTechesOut(bool isAlliance)
        {
            var wu = _weaponUpgrade;
            var dc = _damageControl;


            var drone = GetDrone();
            var frigate = GetFrigate();
            var bc = GetBattlecruiser();
            var bsh = GetBattleship();
            var dread = GetDrednout();

            var techesOut = new Dictionary<TechType, TechOut>
            {
                {wu.TechType, wu.ConvertToOutModel(isAlliance)},
                { dc.TechType, dc.ConvertToOutModel(isAlliance)},
                { drone.TechType, drone.ConvertToOutModel(isAlliance)},
                { frigate.TechType, frigate.ConvertToOutModel(isAlliance)},
                { bc.TechType, bc.ConvertToOutModel(isAlliance)},
                { bsh.TechType, bsh.ConvertToOutModel(isAlliance)},
                { dread.TechType, dread.ConvertToOutModel(isAlliance)}
            };
            return techesOut;
        }

        public Dictionary<TechType, ItemProgress> ConvertToDbTeches()
        {
            return ConvertToDbTeches(_teches);
        }
        public Dictionary<TechType, ItemProgress> ConvertToDbTeches(Dictionary<TechType, Tech> teches)
        {
            return teches.ToDictionary(i => i.Key, i =>
            {
                var item = (ITech)i.Value;
                return item.Progress;
            });
        }
        public Dictionary<TechType, int> GetUnitProfileTechLevels()
        {

            var baseTeches = new Dictionary<TechType, int>
            {
                {TechType.TechDrone, _teches[TechType.TechDrone].GetLevel()},
                {TechType.TechFrigate, _teches[TechType.TechFrigate].GetLevel()},
                {TechType.TechBattlecruiser, _teches[TechType.TechBattlecruiser].GetLevel()},
                {TechType.TechBattleship, _teches[TechType.TechBattleship].GetLevel()},
                {TechType.TechDrednout, _teches[TechType.TechDrednout].GetLevel()},

            };
            return baseTeches;
        }




        public WeaponUpgradeTech GetWeaponUpgrade()
        {
            return _weaponUpgrade;
        }
        public DamageControlTech GetDamageControl()
        {
            return _damageControl;
        }


        public DroneProfileTech GetDrone()
        {
            return (DroneProfileTech)_getTech(TechType.TechDrone, _teches);
        }

        public FrigateProfileTech GetFrigate()
        {
            return (FrigateProfileTech)_getTech(TechType.TechFrigate, _teches);
        }

        public BattlecruiserProfileTech GetBattlecruiser()
        {
            return (BattlecruiserProfileTech)_getTech(TechType.TechBattlecruiser, _teches);
        }

        public BattleshipProfileTech GetBattleship()
        {
            return (BattleshipProfileTech)_getTech(TechType.TechBattleship, _teches);

        }

        public DrednoutProfileTech GetDrednout()
        {
            var drednout = (DrednoutProfileTech)_teches[TechType.TechDrednout];
            if (drednout == null)
            {
                throw new NotImplementedException(nameof(drednout));
            }
            return drednout;
        }

        public static bool AllTechesExist(Dictionary<TechType, Tech> dbTeches)
        {
            var types = Enum.GetNames(typeof(TechType));
            var existKeys = dbTeches.Select(i => i.Key.ToString()).ToList();
            return types.All(type => existKeys.Contains(type));
        }

        public Tech GetTech(TechType techType)
        {
            return _getTech(techType, _teches);
        }

        private Tech _getTech(TechType techType, Dictionary<TechType, Tech> teches)
        {

            if (teches.ContainsKey(techType) && teches[techType] != null)
            {
                return teches[techType];
            }
            else
            {
                throw new ArgumentNullException(nameof(teches), $"not contain tech: {techType}");
            }

        }

        public Dictionary<TechType, BuildItemTechData> CreateBuildItemTechData(bool isAlliance)
        {
            var propertiesView = new Dictionary<TechType, BuildItemTechData>();
            foreach (var techType in _orderedTechesType)
            {
                var tech = GetTech(techType);
                var props = tech.GetPropertiesView(isAlliance);
                propertiesView.Add(techType, new BuildItemTechData(props));
            }
            return propertiesView;
        }


        public Dictionary<TechType, Tech> GetTeches(bool createNew)
        {
            return createNew ? _teches.ToDictionary(i => i.Key, i => i.Value) : _teches;
        }
        public Dictionary<TechType, Tech> SelectTeches(List<TechType> selectTeches)
        {
            return (from techType in selectTeches where _teches.ContainsKey(techType) select _teches[techType]).ToDictionary(i => i.TechType, i => i);

        }

        /// <summary>
        /// Возвращает коллекцию характеристик профильных технологий расчитанных с учетом уровня технологии
        /// </summary>
        /// <returns></returns>
        public Dictionary<TechType, IBattleStatsDouble> GetProfileResultStats()
        {
            return SelectTeches(ProfiTechTypes).ToDictionary(i => i.Key, i => i.Value.GetDoubleStats());
        }

        /// <summary>
        /// Возвращает просумированный с учетом уровня технологий  модификатор TechWeaponUpgrade и TechDamageCont как результат в едином IBattleStatsDouble 
        /// </summary>
        /// <returns></returns>
        public IBattleStatsDouble GetBaseResultStats()
        {
            var wu = (WeaponUpgradeTech)_teches[TechType.TechWeaponUpgrade];
            var dc = (DamageControlTech)_teches[TechType.TechDamageControl];
            return new BattleStatsDouble(wu.GetSummaryBonus(), dc.GetSummaryBonus());
        }


        public bool CalculateTechProgreses(Dictionary<TechType, Tech> teches, UserPremiumWorkModel premium)
        {

            var hasChange = false;
            var col = teches.Select(techItem => techItem.Value)
                .Where(tech =>
                    tech.Progress != null && tech.Progress.IsProgress == true && tech.Progress.CheckProgressIsDone());
            foreach (var tech in col)
            {
                ItemProgress.ProgressUpdateComplite(tech.Progress);
                hasChange = true;
            }
            return hasChange;


        }



        public static TechType UnitTypeToTechType(UnitType unitType)
        {
            byte ut = (byte)unitType;
            TechType techType;
            if (!Enum.TryParse(ut.ToString(), out techType))
            {
                throw new NotImplementedException();
            }
            return techType;


        }

    }


    public abstract class Tech : ITech
    {
        public TechType TechType { get; set; }
        public ItemProgress Progress { get; set; }
        public Dictionary<TechType, int> Conditions { get; set; }
        public bool Disabled { get; set; }
        // ReSharper disable once InconsistentNaming
        protected ISpriteImages __spriteImages;
        protected ISpriteImages _spriteImages => __spriteImages ?? (__spriteImages = new SpriteImages());

        protected Tech()
        {
        }

        protected Tech(TechType techType, int startLevel)
        {
            TechType = techType;
            Progress = new ItemProgress(startLevel);
        }

        protected Tech(TechType techType, ItemProgress progress)
        {
            TechType = techType;
            Progress = progress;
        }

        private TechOut _allianceTechOut;
        private TechOut _personalTechOut;

        public virtual TechOut ConvertToOutModel(bool isAlliance)
        {
            if (isAlliance)
            {
                if (_allianceTechOut != null) return _allianceTechOut;
                return _allianceTechOut = ConvertToAllianceTech();
            }
            else
            {
                if (_personalTechOut != null) return _personalTechOut;
                return _personalTechOut = ConvertToPersonalTech();
            }

        }

        public abstract TechOut ConvertToPersonalTech();
        public abstract TechOut ConvertToAllianceTech();

        protected virtual TechOut _baseConvertToOutModel()
        {
            return new TechOut
            {
                Disabled = Disabled,
                Progress = Progress,
                TechType = TechType,
                Conditions = Conditions
            };
        }

        public abstract Dictionary<TechPropertyKeys, BuildPropertyView> GetPropertiesView(bool isAlliance);

        public int GetLevel()
        {
            if (Disabled)
            {
                return 0;
            }
            if (Progress.Level != null) return (int)Progress.Level;
            return 0;
        }

        protected static bool _conditionsIsCorrect(Dictionary<TechType, int> conditions, Dictionary<TechType, int> otherTeches)
        {
            if (!conditions.Any()) return true;
            if (!otherTeches.Any()) return false;
            var vals = otherTeches.Where(i => conditions.ContainsKey(i.Key)).ToList();
            return vals.All(v => conditions[v.Key] <= v.Value);
        }

        public abstract IBattleStatsDouble GetDoubleStats();

        protected double GetSummaryBonus(double modPerLevel)
        {
            if (Disabled)
            {
                return 0;
            }
            return GetSummaryBonus(GetLevel(), modPerLevel);
 
        }
        protected double GetSummaryBonus(int level, double modPerLevel)
        {
            if (level == 0)
            {
                return 0;
            }
            return level * modPerLevel;
        }

    }

    public class WeaponUpgradeTech : Tech
    {
        public int AtackPersentPerLevel { get; protected set; } = 1;

        public WeaponUpgradeTech() : base(TechType.TechWeaponUpgrade, 0)
        {
        }

        public WeaponUpgradeTech(ItemProgress progress) : base(TechType.TechWeaponUpgrade, progress)
        {
        }

        public override TechOut ConvertToPersonalTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(10000, 10000, 10000, 8000, UnixTime.OneHourInSecond);
            model.Text = new LangField("WeaponUpgradeTech", "WeaponUpgradeTech description");
            model.SpriteImages = _spriteImages.TechImages("tech-wu");
            return model;
        }

        public override TechOut ConvertToAllianceTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(0, 0, 0, 82400);
            model.Text = new LangField("WeaponUpgradeTech alliance", "WeaponUpgradeTech alliance description");
            model.SpriteImages = _spriteImages.AllianceTechImages("tech-wu");
            return model;
        }

        public override Dictionary<TechPropertyKeys, BuildPropertyView> GetPropertiesView(bool isAlliance)
        {
            var props = new Dictionary<TechPropertyKeys, BuildPropertyView>();
            var level = GetLevel();
            var nextLevel = level + 1;

            props.Add(TechPropertyKeys.Level, new BuildPropertyView
            {
                BaseValue = level,
                CurrentValue = level,
                NextValue = level,
                PropertyName = Modules.Localize.Game.Common.Resource.Level,
                PropertyNativeName = TechPropertyKeys.Level.ToString()
            });
            props.Add(TechPropertyKeys.Atack, new BuildPropertyView
            {
                BaseValue = AtackPersentPerLevel,
                CurrentValue = GetSummaryBonus(level,AtackPersentPerLevel),
                NextValue = GetSummaryBonus(nextLevel, AtackPersentPerLevel),
                PropertyName = Modules.Localize.Game.Units.Resource.AttackName,
                PropertyNativeName = TechPropertyKeys.Atack.ToString()
            });
            return props;
        }


        public   double GetSummaryBonus()
        {
            return GetSummaryBonus(AtackPersentPerLevel *0.01);
        }

        public override IBattleStatsDouble GetDoubleStats()
        {
            return new BattleStatsDouble
            {
                Hp = 0,
                Attack = GetSummaryBonus()
            };

        }
    }

    public class DamageControlTech : Tech
    {
        public int HpPersentPerLevel { get; protected set; } = 1;

        public DamageControlTech() : base(TechType.TechDamageControl, 0)
        {
        }

        public DamageControlTech(ItemProgress progress) : base(TechType.TechDamageControl, progress)
        {
        }


        public override TechOut ConvertToPersonalTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(10000, 10000, 10000, 8000, UnixTime.OneHourInSecond);
            model.Text = new LangField("DamageControlTech", "DamageControlTech description");
            model.SpriteImages = _spriteImages.TechImages("tech-dc");
            return model;
        }

        public override TechOut ConvertToAllianceTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(0, 0, 0, 10);
            model.Text = new LangField("DamageControlTech alliance", "DamageControlTech alliance description");
            model.SpriteImages = _spriteImages.AllianceTechImages("tech-dc");
            return model;
        }

        public override Dictionary<TechPropertyKeys, BuildPropertyView> GetPropertiesView(bool isAlliance)
        {
            var props = new Dictionary<TechPropertyKeys, BuildPropertyView>();
            var level = GetLevel();
            var nextLevel = level + 1;

            props.Add(TechPropertyKeys.Level, new BuildPropertyView
            {
                BaseValue = level,
                CurrentValue = level,
                NextValue = nextLevel,
                PropertyName = Modules.Localize.Game.Common.Resource.Level,
                PropertyNativeName = TechPropertyKeys.Level.ToString()
            });
            props.Add(TechPropertyKeys.Hp, new BuildPropertyView
            {
                BaseValue = HpPersentPerLevel,
                CurrentValue = GetSummaryBonus(level, HpPersentPerLevel),
                NextValue = GetSummaryBonus(nextLevel, HpPersentPerLevel),
                PropertyName = Modules.Localize.Game.Units.Resource.HpName,
                PropertyNativeName = TechPropertyKeys.Hp.ToString()
            });
            //if (props[TechPropertyKeys.Hp].CurrentValue == 0)
            //{
            //    props[TechPropertyKeys.Hp].CurrentValue = HpPersentPerLevel;
            //}
            return props;
        }

        
        public   double GetSummaryBonus()
        {
            return GetSummaryBonus(HpPersentPerLevel *0.01);
        }

        public override IBattleStatsDouble GetDoubleStats()
        {
            return new BattleStatsDouble
            {
                Hp = GetSummaryBonus(),
                Attack = 0
            };

        }
    }


    public abstract class UnitProfileTech : Tech
    {
        public double AtackPersentPerLevel { get; protected set; }
        public double HpPersentPerLevel { get; protected set; }

        protected UnitProfileTech()
        {
        }

        protected UnitProfileTech(TechType techType, ItemProgress progress, Dictionary<TechType, int> conditions, Dictionary<TechType, int> otherTeches)
        {
            TechType = techType;
            Progress = progress;
            Conditions = conditions;
            Disabled = !_conditionsIsCorrect(Conditions, otherTeches);
        }

        public double GetAtackSumPercent()
        {
            return GetSummaryBonus(AtackPersentPerLevel);
 
        }

        public double GetHpSumPercent()
        {
            return GetSummaryBonus(HpPersentPerLevel);
        }

        public override Dictionary<TechPropertyKeys, BuildPropertyView> GetPropertiesView(bool isAlliance)
        {
            var props = new Dictionary<TechPropertyKeys, BuildPropertyView>();

            var level = GetLevel();
            var nextLevel = level + 1;
            Progress.Level = level;
  
            props.Add(TechPropertyKeys.Level, new BuildPropertyView
            {
                CurrentValue = level,
                NextValue = nextLevel,
                PropertyName = Modules.Localize.Game.Common.Resource.Level,
                PropertyNativeName = TechPropertyKeys.Level.ToString()
            });
            props.Add(TechPropertyKeys.Atack, new BuildPropertyView
            {
                BaseValue = AtackPersentPerLevel,
                CurrentValue = GetSummaryBonus(level, AtackPersentPerLevel),
                NextValue = GetSummaryBonus(nextLevel, AtackPersentPerLevel),
                PropertyName = Modules.Localize.Game.Units.Resource.AttackName,
                PropertyNativeName = TechPropertyKeys.Atack.ToString()
            });
            props.Add(TechPropertyKeys.Hp, new BuildPropertyView
            {
                BaseValue = HpPersentPerLevel,
                CurrentValue = GetSummaryBonus(level, HpPersentPerLevel),
                NextValue = GetSummaryBonus(nextLevel, HpPersentPerLevel),
                PropertyName = Modules.Localize.Game.Units.Resource.HpName,
                PropertyNativeName = TechPropertyKeys.Atack.ToString()
            });
            //if (props[TechPropertyKeys.Atack].CurrentValue ==0)
            //{
            //    props[TechPropertyKeys.Atack].CurrentValue = AtackPersentPerLevel;
            //}
            //if (props[TechPropertyKeys.Hp].CurrentValue == 0)
            //{
            //    props[TechPropertyKeys.Hp].CurrentValue = HpPersentPerLevel;
            //}
            return props;
        }

        public override IBattleStatsDouble GetDoubleStats()
        {
            var persent = 0.01;
            return new BattleStatsDouble
            {
                Attack = GetAtackSumPercent()* persent,
                Hp = GetHpSumPercent()* persent,
            };

        }

    }

    public class DroneProfileTech : UnitProfileTech
    {
        public DroneProfileTech(ItemProgress progress, Dictionary<TechType, int> otherTeches) : base(TechType.TechDrone, progress, new Dictionary<TechType, int>
        {
            {TechType.TechWeaponUpgrade, 0},
            { TechType.TechDamageControl, 0}
        }, otherTeches)
        {
            AtackPersentPerLevel = 2;
            HpPersentPerLevel = 2;
        }


        public override TechOut ConvertToPersonalTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(5000, 1000, 5000, 3200, UnixTime.OneHourInSecond);
            model.Text = new LangField("DroneProfileTech", "DroneProfileTech description");
            model.SpriteImages = _spriteImages.TechImages("tech-drone");
            return model;
        }

        public override TechOut ConvertToAllianceTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(0, 0, 0,32000);
            model.Text = new LangField("DroneProfileTech alliance", "DroneProfileTech alliance description");
            model.SpriteImages = _spriteImages.AllianceTechImages("tech-drone");
            return model;
        }
    }

    public class FrigateProfileTech : UnitProfileTech
    {
        public FrigateProfileTech(ItemProgress progress, Dictionary<TechType, int> otherTeches) : base(TechType.TechFrigate, progress, new Dictionary<TechType, int>
        {
            {TechType.TechWeaponUpgrade, 8},
            { TechType.TechDamageControl, 8}
        }, otherTeches)
        {
            AtackPersentPerLevel = 2;
            HpPersentPerLevel = 2;
        }


        public override TechOut ConvertToPersonalTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(5000, 5000, 5000, 4000, UnixTime.OneHourInSecond);
            model.Text = new LangField("FrigateProfileTech", "FrigateProfileTech description");
            model.SpriteImages = _spriteImages.TechImages("tech-frigate");
            return model;
        }

        public override TechOut ConvertToAllianceTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(0, 0, 0, 40000);
            model.Text = new LangField("FrigateProfileTech alliance", "FrigateProfileTech alliance description");
            model.SpriteImages = _spriteImages.AllianceTechImages("tech-frigate");
            return model;
        }
    }

    public class BattlecruiserProfileTech : UnitProfileTech
    {
        public BattlecruiserProfileTech(ItemProgress progress, Dictionary<TechType, int> otherTeches) : base(TechType.TechBattlecruiser, progress, new Dictionary<TechType, int>
        {
            {TechType.TechWeaponUpgrade, 15}, {TechType.TechDamageControl, 15}
        }, otherTeches)
        {
            AtackPersentPerLevel = 2;
            HpPersentPerLevel = 2;
        }


        public override TechOut ConvertToPersonalTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(7000, 1000, 7000, 4400, UnixTime.OneHourInSecond*2);
            model.Text = new LangField("BattlecruiserProfileTech", "BattlecruiserProfileTech description");
            model.SpriteImages = _spriteImages.TechImages("tech-battlecruiser");
            return model;
        }

        public override TechOut ConvertToAllianceTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(0, 0, 0, 44000);
            model.Text = new LangField("BattlecruiserProfileTech alliance", "BattlecruiserProfileTech alliance description");
            model.SpriteImages = _spriteImages.AllianceTechImages("tech-battlecruiser");
            return model;
        }
    }

    public class BattleshipProfileTech : UnitProfileTech
    {
        public BattleshipProfileTech(ItemProgress progress, Dictionary<TechType, int> otherTeches) : base(TechType.TechBattleship, progress, new Dictionary<TechType, int>
        {
            {TechType.TechWeaponUpgrade, 23},
            { TechType.TechDamageControl, 23}
        }, otherTeches)
        {
            AtackPersentPerLevel = 2;
            HpPersentPerLevel = 2;
        }


        public override TechOut ConvertToPersonalTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(7000, 5000, 7000, 5200, UnixTime.OneHourInSecond * 3);
            model.Text = new LangField("BattleshipProfileTech", "BattleshipProfileTech  description");
            model.SpriteImages = _spriteImages.TechImages("tech-battleship");
            return model;
        }

        public override TechOut ConvertToAllianceTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(0, 0, 0, 52000);
            model.Text = new LangField("BattleshipProfileTech alliance", "BattleshipProfileTech alliance description");
            model.SpriteImages = _spriteImages.AllianceTechImages("tech-battleship");
            return model;
        }
    }

    public class DrednoutProfileTech : UnitProfileTech
    {
        public DrednoutProfileTech(ItemProgress progress, Dictionary<TechType, int> otherTeches) : base(TechType.TechDrednout, progress, new Dictionary<TechType, int>
        {
            {TechType.TechWeaponUpgrade, 35}, {TechType.TechDamageControl, 35}
        }, otherTeches)
        {
            AtackPersentPerLevel = 2;
            HpPersentPerLevel = 3;
        }

        public override TechOut ConvertToPersonalTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(20000, 30000, 20000, 18000, UnixTime.OneHourInSecond * 4);
            model.Text = new LangField("DrednoutProfileTech", "DrednoutProfileTech description");
            model.SpriteImages = _spriteImages.TechImages("tech-drednout");
            return model;
        }

        public override TechOut ConvertToAllianceTech()
        {
            var model = _baseConvertToOutModel();
            model.BasePrice = new BasePrice(0, 0, 0, 180000);
            model.Text = new LangField("DrednoutProfileTech alliance", "DrednoutProfileTech alliance description");
            model.SpriteImages = _spriteImages.AllianceTechImages("tech-drednout");
            return model;
        }
    }
}
