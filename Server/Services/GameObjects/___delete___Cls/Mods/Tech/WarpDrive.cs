namespace Server.Services.GameObjects.Cls.Mods.Tech
{
    public class WarpDrive:AbstractTech
    {
        public WarpDrive()
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
            name = "t5";
            position = 5;

            //bild Labortory
            depends.Add(new
            {
                name = "namespase.className",
                level = 1
            });

        
        }

    }
}