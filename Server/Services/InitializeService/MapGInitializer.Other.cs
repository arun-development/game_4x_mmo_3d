using System;
using System.Data;
using Server.Core.Map.Structure;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.DataLayer.Repositories;
using Server.Extensions;
using Server.Utils;

namespace Server.Services.InitializeService
{
    public partial class MapGInitializer
    {
        private SysHelperDataModel _generateSystemsNames(IDbConnection connection)
        {
            var gen = new NameGenerator();
            _systemNames = gen.GenerateStarNames();
            var result = new SysHelperDataModel
            {
                Id = (int) SysTypeNames.SystemNames,
                Value = _systemNames.ToSerealizeString()
            };
              _sysHelperRepository.AddOrUpdateeModel(connection,result);
            return result;
        }


        private static Vector3 CreateGalaxyPosition(int galaxyId)
        {
            const int scale = 1;
            var pos = (galaxyId - 1)*scale;
            return new Vector3 {X = pos, Y = pos, Z = pos};
        }

        private static Vector3 CreateSystemPosition()
        {
            // var k = 700*Scale;
            var k = 3400*Scale;

            var coordX = Rand.Next(-k, k)*3;
            var coordY = Rand.Next(-k, k);
            var coordZ = Rand.Next(-k, k)*3;

            return new Vector3(coordX, coordY, coordZ);
        }


        /// <summary>
        ///     todo  не верные результаты
        /// </summary>
        /// <param name="parentPosition"></param>
        /// <param name="orbitRadius"></param>
        /// <param name="orbitPosition"></param>
        /// <param name="orbitAngles"></param>
        /// <returns></returns>
        public static Vector3 CreateFantomPosition(Vector3 parentPosition, double orbitRadius, double orbitPosition,
            Vector3 orbitAngles)
        {
            var k = OrbitStep*orbitPosition;
            var basePoint = new Vector3
            {
                X = orbitRadius*Math.Cos(k),
                Y = 0,
                Z = orbitRadius*Math.Sin(k)
            };

            var bpXsq = Math.Pow(basePoint.X, 2);
            var bpYsq = Math.Pow(basePoint.Y, 2);
            var bpZsq = Math.Pow(basePoint.Z, 2);

            var bpTheta = 0.0;
            var bpPhi = 0.0;

            if (Math.Abs(basePoint.Z) > 0)
            {
                bpTheta = Math.Acos(Math.Pow(basePoint.Z/bpXsq + bpYsq + bpZsq, 0.5));
            }
            if (Math.Abs(basePoint.X) > 0)
            {
                bpPhi = Math.Atan(basePoint.Y/basePoint.X);
            }

            var sumTheta = bpTheta + orbitAngles.Z;
            var sumPhi = bpPhi + orbitAngles.X;

            var relative = new Vector3
            {
                X = orbitRadius*Math.Sin(sumTheta)*Math.Cos(sumPhi),
                Y = orbitRadius*Math.Sin(sumTheta)*Math.Sin(sumPhi),
                Z = orbitRadius*Math.Cos(sumTheta)
            };

            // relative.Calc(parentPosition, "+");
            return relative;
        }


        private StarGeometry _getStar(IDbConnection connection, int id)
        {
            var star =  _systemService.GetGeometryStarById(connection, id, i => new StarGeometry
            {
                GalaxyId = 0,
                SectorId = 0,
                Id = i.Id,
                Radius = i.Radius,
                TextureTypeId = i.TextureTypeId
            });

            var sysTask = _systemService.GetSystem(connection, star.Id, i =>
            {
                star.Coords = i.Position;
                star.GalaxyId = i.GalaxyId;
                star.SectorId = i.SectorId;
                return star;
            });

            var bTask = _systemService.GetDetailSystemBySystemId(connection, star.Id, i =>
            {
                star.NativeName = i.Name;
                return star;
            });
 
            return star;
        }


        private static double _getRandomV3Component(double f)
        {
            return Math.Round(Rand.NextDouble()*f*Rand.Next(-1, 1), 4);
        }

        private static Vector3 _getRandomAngle(double f)
        {
            return new Vector3(_getRandomV3Component(f), _getRandomV3Component(f), _getRandomV3Component(f));
        }

        private static string RandomAngle(double f)
        {
            return _getRandomAngle(f).ToSerealizeString();
        }

        //запускается из Moon


        private static byte GetMoonCount(byte planetPosition)
        {
            byte moonCount = 0;

            var chance = Convert.ToDouble("0," + (1 + planetPosition));
            var q = Rand.NextDouble();

            if (chance >= q && planetPosition >= 3 && planetPosition <= 5) moonCount = (byte)Rand.Next(0, 2);
            if (planetPosition > 5) moonCount = (byte)Rand.Next(0, 5);

            return moonCount;
        }


        private static bool HasRings(int planetPosition, ref int secondRingCoef)
        {
            if (planetPosition <= 5) return false;

            var chance = (0.1*planetPosition)/secondRingCoef;
            var hasRing = (chance > Rand.NextDouble() + 0.01);
            if (hasRing) secondRingCoef *= 8;

            return hasRing;
        }
    }
}