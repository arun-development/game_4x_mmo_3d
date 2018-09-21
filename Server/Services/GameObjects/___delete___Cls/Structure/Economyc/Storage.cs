//storage shorn name =ps2

using System;
using System.Reflection;
using Newtonsoft.Json.Linq;

namespace Server.Services.GameObjects.Cls.Structure.Economyc
{
    /// <summary>
    /// Класс хранилища, хранит текущие начения ресурсов и максимально хранимый обхем
    /// </summary>
    public class Storage : AbstractStructure, IObserver<NotyfyData>
    {
        private double ECurrent { get; set; }
        private double IrCurrent { get; set; }
        private double DmCurrent { get; set; }
        private double AmCurrent { get; set; }
        private DateTime LastDate { get; set; }

        private IDisposable unsubscriber;

        private int BaseStorageValue { get; set; }

        public Storage(int planetId)
        {
            Name = "ps2";
            PlanetId = planetId;

            //Базовая стоимость 
            EPrice = 1;
            IrPrice = 546;
            DmPrice = 78;
            AmPrice = 12;
            TimePrice = 600;
            SgPrice = 12;

            BaseStorageValue = 55000;

            //Модификатор на уровень
            LevelMod = 2;

            var structures = PlanetHelper.GetStructures(planetId);

            Level = (int) structures[GetName()];

            var db = new skagryDataContext();

            var tblResourceStorage = db.GetTable<planet_resource_storage>();

            var query =
                from rs in tblResourceStorage
                where rs.planet_id == GetPlanetId()
                where rs.date_change == (
                    from tmp in tblResourceStorage
                    where tmp.planet_id == GetPlanetId()
                    select tmp.date_change
                    ).Max()
                select new
                {
                    rs
                };

            foreach (var row in query)
            {
                ECurrent = row.rs.e_current.Value;
                IrCurrent = row.rs.ir_current.Value;
                DmCurrent = row.rs.dm_current.Value;
                AmCurrent = row.rs.am_current.Value;
                LastDate = (DateTime) row.rs.date_change;
            }
        }

        public void Subscribe(IObservable<NotyfyData> provider)
        {
            if (provider != null)
                unsubscriber = provider.Subscribe(this);
        }

        public virtual void Unsubscribe()
        {
            unsubscriber.Dispose();
        }


        /// <summary>
        /// Получает максимальный обхем всего хранилища
        /// </summary>
        /// <returns>Максимальный обхем всего хранилища с учетом всех модификаторов</returns>
        public double GetResultValue()
        {
            int charSkillLevel = 0;
            double charSkillBaseValue = 0;

            // get character mods
            Character character = PlanetHelper.GetCharacter(PlanetId);

            if (null != character)
            {
                // todo get from character
                var charSkills = character.GetSkillLevels();

                charSkillLevel = (int) charSkills["s12"];
                charSkillBaseValue = character.GetSkill("s12").GetValue();
            }

            return BaseStorageValue*(Math.Pow(LevelMod, GetLevel() - 1)*((charSkillLevel*charSkillBaseValue) + 1));
        }


        public double GetECurrent()
        {
            return ECurrent;
        }

        public double GetIrCurrent()
        {
            return IrCurrent;
        }

        public double GetDmCurrent()
        {
            return DmCurrent;
        }

        public double GetAmCurrent()
        {
            return AmCurrent;
        }

        public DateTime GetLastDate()
        {
            return LastDate;
        }

        public double GetBaseStorageValue()
        {
            return BaseStorageValue;
        }

        public double GetResultEMax()
        {
            return (double) (GetResultValue()*3/11);
        }

        public double GetResultIrMax()
        {
            return (double) (GetResultValue()/11);
        }

        public double GetResultDmMax()
        {
            return (double) (GetResultValue()/11);
        }

        public double GetResultAmMax()
        {
            return (double) (GetResultValue()/11);
        }


        /// <summary>
        /// Вызываеться при приходе новых данных от обхекта наблюдения (Применяеться в случаях конда запрос нужен не от клиента. Пример обновился уровеньздания которое влияет на значение перечисленных переменных)
        /// </summary>
        /// <param name="value">Все данные полученные от обхекта наблюдения</param>
        public void OnNext(NotyfyData value)
        {
            AddCurrentResources(value.ERate, value.IrRate, value.DmRate, value.AmRate);
        }

        /// <summary>
        /// срабатывает для уведомления наблюдателя об ошибках в обхекте наблюдения
        /// </summary>
        /// <param name="error">Обхект ошибки</param>
        public void OnError(Exception error)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// срабатывает по окончании  получения данных. не реалезованн
        /// </summary>
        public void OnCompleted()
        {
            //throw new NotImplementedException();
        }

        /// <summary>
        /// Обновляет максимальные значения объёмов хранимых ресурсов
        /// </summary>
        public void UpdateResulstMax()
        {
            var db = new skagryDataContext();

            var tblResourceStorage = db.GetTable<planet_resource_storage>();

            var query =
                from rs in tblResourceStorage
                where rs.planet_id == PlanetId
                select rs;

            foreach (var row in query)
            {
                row.e_max = GetResultEMax();
                row.ir_max = GetResultIrMax();
                row.dm_max = GetResultDmMax();
                row.am_max = GetResultAmMax();
            }

            try
            {
                db.SubmitChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }


        /// <summary>
        /// Добавляет К значению хранимых ресурсов значение прироста ресурсов из базы данных из таблицы ресурс рейт. Обработка запроса от клиента.
        /// </summary>
        /// <param name="eValueAdded">Добавляемое значения для энергии</param>
        /// <param name="irValueAdded">Добавляемое значения для Ир</param>
        /// <param name="dmValueAdded">Добавляемое значения для Дм</param>
        /// <param name="amValueAdded">Добавляемое значения для АМ</param>
        public void AddCurrentResources()
        {
            var db = new skagryDataContext();

            var tblPlanetResourseRate = db.GetTable<planet_resource_rate>();

            var query =
                from prr in tblPlanetResourseRate
                where prr.planet_id == PlanetId
                select prr;

            double newERrate = 0;
            double newIrrate = 0;
            double newDmrate = 0;
            double newAmrate = 0;


            foreach (var row in query)
            {
                newERrate = (double) row.e_rate;
                newIrrate = (double) row.ir_rate;
                newDmrate = (double) row.dm_rate;
                newAmrate = (double) row.am_rate;
//                row.date_change = DateTime.UtcNow;
            }

            AddCurrentResources(newERrate, newIrrate, newDmrate, newAmrate);
        }


        /// <summary>
        /// Добавляет К значению хранимых ресурсов значение прироста ресурсов от обсерверабле
        /// </summary>
        /// <param name="eValueAdded">Добавляемое значения для энергии</param>
        /// <param name="irValueAdded">Добавляемое значения для Ир</param>
        /// <param name="dmValueAdded">Добавляемое значения для Дм</param>
        /// <param name="amValueAdded">Добавляемое значения для АМ</param>
        public void AddCurrentResources(double eValueAdded, double irValueAdded, double dmValueAdded,
            double amValueAdded)
        {
            var db = new skagryDataContext();

            var tblPlanetResourceStorage = db.GetTable<planet_resource_storage>();

            var newEValue = GetNewResourceValue("EMax", GetECurrent(), eValueAdded);
            var newIrValue = GetNewResourceValue("IrMax", GetIrCurrent(), irValueAdded);
            var newDmValue = GetNewResourceValue("DmMax", GetDmCurrent(), dmValueAdded);
            var newAmValue = GetNewResourceValue("AmMax", GetAmCurrent(), amValueAdded);

            var query =
                from rs in tblPlanetResourceStorage
                where rs.planet_id == PlanetId
                select rs;

            foreach (var row in query)
            {
                row.e_current = newEValue;
                row.ir_current = newIrValue;
                row.dm_current = newDmValue;
                row.am_current = newAmValue;
                row.date_change = DateTime.UtcNow;
            }

            var oldECurrent = GetECurrent();
            var oldIrCurrent = GetIrCurrent();
            var oldDmCurrent = GetDmCurrent();
            var oldAmCurrent = GetAmCurrent();
            var oldLastDate = GetLastDate();

            try
            {
                db.SubmitChanges();

                ECurrent = newEValue;
                IrCurrent = newIrValue;
                DmCurrent = newDmValue;
                AmCurrent = newAmValue;
            }
            catch (Exception e)
            {
                ECurrent = oldECurrent;
                IrCurrent = oldIrCurrent;
                DmCurrent = oldDmCurrent;
                AmCurrent = oldAmCurrent;
                LastDate = oldLastDate;
            }
        }



        /// <summary>
        /// Возвращает новое значение для выбранного хранимого ресурса
        /// </summary>
        /// <param name="resourceName">Имя ресурса для прироста. Пример: 'EMax (См. GetResultEMax())'</param>
        /// <param name="resourceCurrentValue">Текущие значени для ресурса по имени resourceName </param>
        /// <param name="resourceValueAdded"> Добавляемое значение (прирост - источник индустриальный комплекс, мазер, юниты)</param>
        /// <returns></returns>
        private double GetNewResourceValue(string resourceName, double resourceCurrentValue, double resourceValueAdded)
        {
            //время в часах прошедшее после последнего добавления значний в базу
            var CurrentDate = DateTime.UtcNow;
            var duration = CurrentDate.Subtract(LastDate).TotalHours;

            string methodGetMax = "GetResult" + resourceName;
            Type thisType = this.GetType();
            MethodInfo theMethod = thisType.GetMethod(methodGetMax);

            double maxResourceValue = (double) theMethod.Invoke(this, null);

            var units = PlanetHelper.GetUnits(PlanetId);

            var unitClasses = units.Properties();

            double armyBaseSumECost = 0;

            foreach (JProperty unitDiccionary in unitClasses)
            {
                var unitClassAlias = unitDiccionary.Name;

                if ("a" == unitClassAlias.Substring(0, 1))
                {
                    var unitClass = UnitHelper.GetUnitClass((string) unitClassAlias);

                    if (unitClass != null)
                    {
                        var type = Type.GetType(unitClass);

                        if (type != null)
                        {
                            ArmyUnit unit = (ArmyUnit) Activator.CreateInstance(type);

                            armyBaseSumECost += unit.ArmyECoast*(int) units[unitClassAlias];
                        }
                    }
                }
            }

            var mainCharacter = PlanetHelper.GetMainCharacter(1);
            var charSkillLevel = 0;
            double charSkillBaseValue = 0;

            if (null != mainCharacter)
            {
                var charSkills = mainCharacter.GetSkillLevels();

                charSkillLevel = (int) charSkills["s20"];
                charSkillBaseValue = mainCharacter.GetSkill("s20").GetValue();
            }

            var armyResultSumECost = armyBaseSumECost;

            if (0 < charSkillLevel)
            {
                armyResultSumECost = armyBaseSumECost*(charSkillLevel*charSkillBaseValue);
            }

            double saldoResource = 0;

            saldoResource += resourceValueAdded;

            if ("EMax" == resourceName)
            {
                saldoResource -= armyResultSumECost;
            }

            double sumResourceValue = resourceCurrentValue + saldoResource*duration;

            double intSumResourceValue = sumResourceValue;

            return (intSumResourceValue < maxResourceValue) ? intSumResourceValue : maxResourceValue;
        }
    }
}
