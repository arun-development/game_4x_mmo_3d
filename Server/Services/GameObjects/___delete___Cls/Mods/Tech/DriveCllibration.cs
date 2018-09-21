namespace Server.Services.GameObjects.Cls.Mods.Tech
{
    public class DriveCllibration:AbstractTech
    {
        public DriveCllibration()
        {
            //            price
            EPrice = 1;
            IrPrice = 1;
            DmPrice = 1;
            AmPrice = 2;
            TimePrice = 300;
            SgPrice = 123;
            //x*n
            value = 0.02;
            name = "t9";
            position = 9;

            depends.Add(new
            {
                //tech.WarpDrive
                name = "namespase.className",
                level = 5
            });

            //Bild.Labortory
            depends.Add(new
            {
                name = "namespase.classNam2",
                level = 10
            });
        }
}
}