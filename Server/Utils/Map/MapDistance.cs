using System;
using Server.Core.Map;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive;

namespace Server.Utils.Map
{
    public class MapDistance : Cached
    {
        private const double StepPerGalaxyTime = 0.1;
        private const double StepPerSectorTime = 100;
        private const double StepPerSystemTime = 0.05;
        private const double StepPerPlanetTime = 50;

        private readonly bool _calcByGalaxy;
        private readonly bool _calcByPlanet;
        private readonly bool _calcBySector;
        private readonly bool _calcBySystem;

        private readonly double _galaxyRange;
        private readonly double _planetRange;
        private readonly double _sectorRange;
        private readonly double _systemRange;

        public MapAdress Source;
        public MapAdress Target;
        public int Sec;
        public string FormatedSeconds;

        public MapDistance(MapAdress source, MapAdress target, bool calcMotherFleet)
        {
            Source = source;
            Target = target;

            _galaxyRange = Math.Abs(Source.Galaxy - Target.Galaxy);
            if (Math.Abs(_galaxyRange) > 1)
            {
                if (Source.GalaxyPosition == null || Target.GalaxyPosition == null)
                    throw new Exception(Error.InputDataIncorrect);
                _galaxyRange = Vector3.CalcDistance(Source.GalaxyPosition, Target.GalaxyPosition);
                _calcByGalaxy = true;
                return;
            }

            _sectorRange = Math.Abs(Source.Sector - Target.Sector);
            if (Math.Abs(_sectorRange) > 1)
            {
                if (Source.SectorPosition == null || Target.SectorPosition == null)
                    throw new Exception(Error.InputDataIncorrect);
                _sectorRange = Vector3.CalcDistance(Source.SectorPosition, Target.SectorPosition);
                _calcBySector = true;
                return;
            }


            if (calcMotherFleet && Source.System == Target.System)
            {
                if (Target.PlanetPosition == null) throw new Exception(Error.InputDataIncorrect);
                _calcByPlanet = true;
                const int motherRange = 25;
                _planetRange = motherRange - Target.PlanetPosition.X;
                if (_planetRange < 5) _planetRange = 5;
                return;
            }
            if (Source.System == Target.System)
            {
                if (Source.PlanetPosition == null || Target.PlanetPosition == null)
                    throw new Exception(Error.InputDataIncorrect);
                _calcByPlanet = true;
                _planetRange = Vector3.CalcDistance(Source.PlanetPosition, Target.PlanetPosition);
                return;
            }

            if (Source.SystemPosition == null || Target.SystemPosition == null)
                throw new Exception(Error.InputDataIncorrect);
            _systemRange = Vector3.CalcDistance(Source.SystemPosition, Target.SystemPosition);
            _calcBySystem = true;
        }




        public void SetTime(int second)
        {
            Sec = second;
            FormatedSeconds = UnixTime.ConvertSecondToFormat(second, UnixTime.Format_hh_mm_ss);
        }


        private double CalcSecondsByGalaxy()
        {
            return _calcTime(StepPerGalaxyTime * _galaxyRange, 1500, 7200);
        }

        private double CalcSecondsBySector()
        {
            return _calcTime(StepPerSectorTime * _sectorRange, 1200, 7200);
 
        }

        private double CalcSecondsBySystem()
        {
            return _calcTime(StepPerSystemTime * _systemRange, 600, 7200);
 
        }

        private double CalcSecondsByPlanet()
        {
 
            return _calcTime(StepPerPlanetTime * _planetRange,300,7200);
        }

        private double _calcTime(double time, double minTime, double maxTime)
        {
            var medTime = time / 3;
            if (time > maxTime) time = maxTime;
            else if (time > medTime) time = time - ((time - medTime) / 2);
            if (time < minTime) time = minTime;
            return time;
        }

        private double CalcSecond()
        {
            if (_calcByPlanet) return CalcSecondsByPlanet();
            if (_calcBySystem) return CalcSecondsBySystem();
            if (_calcBySector) return CalcSecondsBySector();
            if (_calcByGalaxy) return CalcSecondsByGalaxy();
            throw new Exception(Error.InputDataIncorrect);
        }


        /// <summary>
        ///     Расчитывает и устанавливает базовое вермя перемещения между космическими объектами исходя из итогового модификатора
        ///     перемещения. и параметров конструктора
        /// </summary>
        /// <param name="calculatedModificator"></param>
        /// from 0  to 1;
        public void CalcAndSetSecond(double calculatedModificator = 1)
        {
            if (Math.Abs(calculatedModificator) < 0.001) calculatedModificator = 1;
            var second = CalcSecond()*calculatedModificator;
            if (second<10)
            {
                second = 10;
            }
            SetTime((int) Math.Floor(second));
        }
    }
}