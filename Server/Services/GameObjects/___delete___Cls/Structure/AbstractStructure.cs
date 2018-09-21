using System;

namespace Server.Services.GameObjects.Cls.Structure
{
    public abstract class AbstractStructure
    {
        protected int AmPrice;
        protected int DmPrice;
        protected int EPrice;
        protected int IrPrice;
        protected int Level;
        protected double LevelMod;
        protected string Name;
        protected int PlanetId;
        protected int SgPrice;
        protected int TimePrice;

        public string GetName()
        {
            return Name;
        }

        public int GetEPrice()
        {
            return EPrice;
        }

        public int GetIrPrice()
        {
            return IrPrice;
        }

        public int GetDmPrice()
        {
            return DmPrice;
        }

        public int GetAmPrice()
        {
            return AmPrice;
        }

        public int GetSgPrice()
        {
            return SgPrice;
        }

        public int GetTimePrice()
        {
            return TimePrice;
        }


        public int GetLevel()
        {
            return Level;
        }

        public double GetLevelMod()
        {
            return LevelMod;
        }

        protected int GetPlanetId()
        {
            return PlanetId;
        }

        public void UpLevel()
        {
            var db = new skagryDataContext();

            var tblStructureTurn = db.GetTable<structure_turn>();

            int charSkillLevel = 0;
            double charSkillBaseValue = 0;

            // get character mods
            Character character = PlanetHelper.GetCharacter(PlanetId);

            if (null != character)
            {
                // todo get from character
                var charSkills = character.GetSkillLevels();

                charSkillLevel = (int)charSkills["s16"];
                charSkillBaseValue = character.GetSkill("s16").GetValue();
            }

            var startDate = DateTime.UtcNow;

            var duration = GetTimePrice()*Math.Pow(GetLevelMod(), GetLevel());

            if (0 < charSkillLevel)
            {
                duration *= charSkillBaseValue*charSkillLevel;
            }
            
            var endDate = startDate.AddSeconds(duration);

            tblStructureTurn.InsertOnSubmit(new structure_turn
            {
                planet_id = GetPlanetId(),
                structure_class_name = GetName(),
                next_level = GetLevel() + 1,
                start_date = startDate,
                end_date = endDate
            });

            db.SubmitChanges();
        }
    }
}


