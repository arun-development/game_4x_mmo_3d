namespace Server.Services.GameObjects.Cls.Mods.Tech
{
    public class HpArmy : AbstractTech
    {
        public HpArmy()
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
            name = "t2";
            position = 2;
        }
    }
}