namespace Server.Services.GameObjects.Cls.Mods.Tech
{
    public class HyperDrive:AbstractTech
    {
        public HyperDrive()
        {  
            //            price
            EPrice = 1;
            IrPrice = 1;
            DmPrice = 1;
            AmPrice = 2;
            TimePrice = 300;
            SgPrice = 123;
            //x*n
            value = 0.05;
            name = "t10";
            position = 10;
        }
    }
}