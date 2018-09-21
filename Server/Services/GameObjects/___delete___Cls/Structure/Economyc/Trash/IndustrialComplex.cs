/*//IndustrialComplex shorn name =ps1


using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using api.skagry.Areas.skagry.Cls.Mods;
using api.skagry.Areas.skagry.Models;
using Microsoft.Ajax.Utilities;

namespace api.skagry.Areas.skagry.Cls.Structure.Defence.Trash


{
    /// <summary>
    /// Индустриальный комплекс
    /// </summary>
    public class IndustrialComplex : AbstractStructure, IObservable<NotyfyData>
    {
        private int EBaseValue { get; }
        private List<IObserver<NotyfyData>> observers;

        /// <summary>
        /// Конструктор индустриального комплекса
        /// </summary>
        /// <param name="planetId">Ид планеты где расположен индустриальный комплекс</param>
        public IndustrialComplex(int planetId)
        {
            observers = new List<IObserver<NotyfyData>>();

            //Короткое имя для работы с бд (с массивом)
            Name = "ps1";

            //Базовая стоимость индустриального комплекса
            EPrice = 1;
            IrPrice = 546;
            DmPrice = 78;
            AmPrice = 12;
            TimePrice = 600;
            SgPrice = 12;

            //Модификатор на уровень
            LevelMod = 2;

            //Параметры индустриального комплекса
            EBaseValue = 1000;


            var structures = PlanetHelper.GetStructures(planetId);

            PlanetId = planetId;

            Level = (int) structures[GetName()];
        }


        /// <summary>
        /// Получает текущие уровень добычи энергии
        /// </summary>
        /// <returns>Количество  полной энергии с учетом всех модификаторов(чар, уровень Инд ко.)</returns>
        public double GetRate()
        {
            int charSkillLevel = 0;
            double charSkillBaseValue = 0;

            // get character mods
            Character character = PlanetHelper.GetMainCharacter(1);

            if (null != character)
            {
                // todo get from character
                var charSkills = character.GetSkillLevels();

                charSkillLevel = (int) charSkills["s11"];
                charSkillBaseValue = character.GetSkill("s11").GetValue();
            }

            // get self mods
            // calculate


            return EBaseValue*Math.Pow(LevelMod, GetLevel() - 1)*((charSkillLevel*charSkillBaseValue) + 1);
        }


        /// <summary>
        /// Получает текущее значение прироста ресурсов(Evalue E IR Dm Am)
        /// </summary>
        /// <returns>Массив текущих значений</returns>
        public Hashtable GetCurrentRates()
        {
            var rates = new Hashtable();

            var db = new skagryDataContext();

            var tblPlanetResourseRate = db.GetTable<planet_resource_rate>();

            var query =
                from prr in tblPlanetResourseRate
                where prr.planet_id == PlanetId
                where prr.date_change == (
                    from prrDch in tblPlanetResourseRate
                    where prrDch.planet_id == PlanetId
                    select prrDch.date_change
                    ).Max()
                select prr;

            foreach (var row in query)
            {
                rates.Add("e_value", GetRate());
                rates.Add("e_rate", row.e_rate);
                rates.Add("ir_rate", row.ir_rate);
                rates.Add("dm_rate", row.dm_rate);
                rates.Add("am_rate", row.am_rate);
            }

            return rates;
        }


        /// <summary>
        /// Обновляет текущие значения прироста рейтов новыми значениями
        /// </summary>
        /// <param name="newERate"></param>
        /// <param name="newIrRate"></param>
        /// <param name="newDmRate"></param>
        /// <param name="newAmRate"></param>
        public void UpdateRates(double newERate, double newIrRate, double newDmRate, double newAmRate)
        {
            var EMaxValue = GetRate();

            newIrRate = (newIrRate < EMaxValue) ? newIrRate : EMaxValue;
            EMaxValue = EMaxValue - newIrRate;

            newDmRate = (2*newDmRate < EMaxValue) ? newDmRate : EMaxValue/2;
            EMaxValue = EMaxValue - newDmRate*2;

            newAmRate = (5*newAmRate < EMaxValue) ? newAmRate : EMaxValue/5;
            EMaxValue = EMaxValue - newAmRate*5;

            newERate = (newERate < EMaxValue) ? newERate : EMaxValue;
            EMaxValue = EMaxValue - newERate;

            if (0 < EMaxValue)
            {
                newERate = newERate + EMaxValue;
            }

            var db = new skagryDataContext();

            var tblPlanetResourseRate = db.GetTable<planet_resource_rate>();

            var query =
                from prr in tblPlanetResourseRate
                where prr.planet_id == PlanetId
                select prr;


            foreach (var row in query)
            {
                row.e_rate = newERate;
                row.ir_rate = newIrRate;
                row.dm_rate = newDmRate;
                row.am_rate = newAmRate;
                row.date_change = DateTime.UtcNow;
            }

            db.SubmitChanges();

            Notify(new NotyfyData
            {
                ERate = newERate,
                IrRate = newIrRate,
                DmRate = newDmRate,
                AmRate = newAmRate
            });
        }


        /// <summary>
        /// Получает Дату последнего обновления данных о приросте
        /// </summary>
        /// <returns>Дата</returns>
        public DateTime GetLastDateTime()
        {
            var db = new skagryDataContext();

            var tblPlanetResourseRate = db.GetTable<planet_resource_rate>();

            return (from pr in tblPlanetResourseRate
                where pr.planet_id == GetPlanetId()
                select pr.date_change).Max();
        }


        /// <summary>
        /// Подписывает слушателей или обхекты слушателей на свои обновления
        /// </summary>
        /// <param name="observer">Объект наблюдателя</param>
        /// <returns>Отписывает объект подписки слушателя</returns>
        public IDisposable Subscribe(IObserver<NotyfyData> observer)
        {
            if (!observers.Contains(observer))
                observers.Add(observer);

            return new Unsubscriber(observers, observer);
        }

        /// <summary>
        /// Отписывает наблюдателя от подписки слушателя
        /// </summary>
        private class Unsubscriber : IDisposable
        {
            private List<IObserver<NotyfyData>> _observers;
            private IObserver<NotyfyData> _observer;

            public Unsubscriber(List<IObserver<NotyfyData>> observers, IObserver<NotyfyData> observer)
            {
                this._observers = observers;
                this._observer = observer;
            }

            public void Dispose()
            {
                if (_observer != null && _observers.Contains(_observer))
                    _observers.Remove(_observer);
            }
        }


        /// <summary>
        /// Оповещает наблюдателей об изменениях
        /// </summary>
        /// <param name="loc">Объект данных для набблюдателей</param>
        public void Notify(NotyfyData? loc)
        {
            foreach (var observer in observers)
            {
                if (loc.HasValue)
                    observer.OnNext(loc.Value);
            }
        }
    }
}



*/