namespace Server.Services.InitializeService
{
    public partial class MapGInitializer
    {
        private void DeleteDetailSystem()
        {
            var systemData = DbG.g_detail_system.Select(ss => ss);
            if (systemData.Any())
            {
                DbG.g_detail_system.DeleteAllOnSubmit(systemData);
                //                db.ExecuteCommand("DBCC CHECKIDENT('[dbo].[g_detail_system]', RESEED, 0);");
                DbG.SubmitChanges();
            }
        }


        private void DeleteSystemGeometry()
        {
            var systemGeometry = DbG.g_geometry_system.Select(ss => ss);
            if (systemGeometry.Any())
            {
                DbG.g_geometry_system.DeleteAllOnSubmit(systemGeometry);
                //                db.ExecuteCommand("DBCC CHECKIDENT('[dbo].[g_geometry_system]', RESEED, 0);");
                DbG.SubmitChanges();
            }
        }

        private void DeleteSystem()
        {
            var system = DbG.g_system.Select(ss => ss);
            if (system.Any())
            {
                DbG.g_system.DeleteAllOnSubmit(system);
                DbG.ExecuteCommand("DBCC CHECKIDENT('[dbo].[g_system]', RESEED, 0);");
                DbG.SubmitChanges();
            }
        }

        private void DeleteSectors()
        {
            var systemGeometry = DbG.g_sectors.Select(ss => ss);
            if (systemGeometry.Any())
            {
                DbG.g_sectors.DeleteAllOnSubmit(systemGeometry);
                DbG.ExecuteCommand("DBCC CHECKIDENT('[dbo].[g_sectors]', RESEED, 0);");
                DbG.SubmitChanges();
            }
        }

        private void DeleteMoonGeometry()
        {
            var moons = DbG.g_geometry_moon.Select(ss => ss);
            if (!moons.Any()) return;
            DbG.g_geometry_moon.DeleteAllOnSubmit(moons);
            DbG.ExecuteCommand("DBCC CHECKIDENT('[dbo].[g_geometry_moon]', RESEED, 0);");
            DbG.SubmitChanges();
        }

        private void DeleteMoonDetail()
        {
            var moonsDetail = DbG.g_detail_moon.Select(ss => ss);
            if (!moonsDetail.Any()) return;
            DbG.g_detail_moon.DeleteAllOnSubmit(moonsDetail);
            //Db.ExecuteCommand("DBCC CHECKIDENT('[dbo].[g_detail_moon]', RESEED, 0);");
            DbG.SubmitChanges();
        }


        private void DeleteMoons()
        {
            DeleteMoonDetail();
            DeleteMoonGeometry();
        }
    }
}