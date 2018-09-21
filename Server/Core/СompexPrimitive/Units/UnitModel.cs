using System;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Resources;
using Server.Modules.Localize;

namespace Server.Core.СompexPrimitive.Units

{
    public enum UnitType
    {
        Drone = 1,
        Frigate = 2,
        Battlecruiser = 3,
        Battleship = 4,
        Drednout = 5,
    }

    public class UnitModel : ICreateNew<UnitModel>
    {
        public string Key;
        public int Count;
        private LangField _text;

        public LangField Text
        {
            get
            {
                if (_text != null) return _text;
                UnitType unitType;
                Enum.TryParse(Key, out unitType);
                _text = UnitHelper.GetTranslate(unitType);
                return _text;
            }
        }


        public BasePrice BasePrice;
        public UnitStats UnitStats;
        public SpriteImages SpriteImages;
        public readonly Dictionary<string, int> BattleTechCondidion;

        public UnitModel() 
        {
        }

        public UnitModel(UnitModel other)
        {
            Key = other.Key;
            Count = other.Count;
  
            BasePrice = other.BasePrice.CreateNewFromThis();
            UnitStats = other.UnitStats.CreateNewFromThis();
            SpriteImages = other.SpriteImages.CreateNewFromThis();
            if (other.BattleTechCondidion != null)
            {
                BattleTechCondidion = other.BattleTechCondidion.ToDictionary(i => i.Key, i => i.Value);
            }
         

        }


        public UnitModel CreateNew(UnitModel other)
        {
           return new UnitModel(other);
        }

        public UnitModel CreateNewFromThis()
        {
            return new UnitModel(this);
        }

    }
}