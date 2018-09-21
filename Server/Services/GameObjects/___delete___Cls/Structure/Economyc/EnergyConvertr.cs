using System;
using System.Collections;

namespace Server.Services.GameObjects.Cls.Structure.Economyc
{
    public class EnergyConvertr : AbstractStructure
    {
        private double BaseEnergyConvertrWaste { get; set; }

        public EnergyConvertr(int planetId)
        {
            Name = "ps3";

            //Базовая стоимость 
            EPrice = 1;
            IrPrice = 1;
            DmPrice = 1;
            AmPrice = 1;
            TimePrice = 1;
            SgPrice = 1;

            BaseEnergyConvertrWaste = 0.5;

            //Модификатор на уровень
            LevelMod = 2;

            var structures = PlanetHelper.GetStructures(planetId);

            PlanetId = planetId;

            Level = (int)structures[GetName()];
        }

        /// <summary>
        /// Конвертирует из одного ресурса в другой 
        /// </summary>
        /// <param name="fromType">Тип исходноо ресурса</param>
        /// <param name="fromValue">Количество исходного ресурса</param>
        /// <param name="toType">Получаемый ресурс(тип получаемого ресурса)</param>
        /// <returns>Количество получаемого ресурса</returns>
        public double Convert(string fromType, double fromValue, string toType)
        {
            Hashtable coeficients = new Hashtable();

            coeficients.Add("E", 1);
            coeficients.Add("Ir", 1);
            coeficients.Add("Dm", 2);
            coeficients.Add("Am", 5);

            var result = ((double)coeficients[fromType]*fromValue)/(double)coeficients[toType];

            var coefEnergyConverterResult = Math.Pow(BaseEnergyConvertrWaste, (8/(Level+8)));

            return coefEnergyConverterResult * result;
        }
    }
}

// todo записать данны е в базу, прикрутить АпгрейдСтруктуру (метод) к этому зданию.ОТригулировать формулу коэфф
