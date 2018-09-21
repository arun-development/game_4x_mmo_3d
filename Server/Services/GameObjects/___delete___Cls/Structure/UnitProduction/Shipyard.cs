using System;

namespace Server.Services.GameObjects.Cls.Structure.UnitProduction
{
    public class Shipyard : AbstractStructure
    {
        private const int UNIT_FLEET = 1;

        private const int UNIT_TRANSPORT = 2;

        private const int UNIT_SPY = 3;

        public override string GetName()
        {
            return "shipyard";
        }

        public Shipyard(int planetId)
        {
            Name = "ps11";
            PlanetId = planetId;

            EPrice = 1;
            IrPrice = 1;
            DmPrice = 1;
            AmPrice = 1;
            TimePrice = 1;
            SgPrice = 1;

            var name = GetName();
            var db = new skagryDataContext();

            var tblPlanetStructure = db.GetTable<planet_structure>();

            var query =
                from ps in tblPlanetStructure
                where ps.planet_id == planetId
                where ps.structure_name == name
                select new
                {
                    ps
                };

            foreach (var row in query)
            {
                Level = row.ps.level.Value;
            }
        }

        // todo zavershit logiku. poluchit mody ot planet_charaktera
        // на планете должен быть метод который возвразает персоонажа а у персоонажа должен быть метод который возвращает планету
        // 
        public void FleetConstruction(FleetUnit unit, int cuantity)
        {
            var db = new skagryDataContext();

            var tblShipyard = db.GetTable<shipyard_turn>();

            var startTime = DateTime.UtcNow;
            var endTime = startTime.AddHours(1);

            tblShipyard.InsertOnSubmit(new shipyard_turn
            {
                planet_id = 1,
                unit_name = unit.GetName(),
                cuantity = cuantity,
                start_time = startTime,
                end_time = endTime

            });
        }
    }
}