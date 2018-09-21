namespace Server.Services.GameObjects.Cls.Mods.Tech
{
    public class HangarMazer:AbstractTech
    {
        public HangarMazer()
        {
            //            price
            EPrice = 1;
            IrPrice = 1;
            DmPrice = 1;
            AmPrice = 2;
            TimePrice = 300;
            SgPrice = 123;
            //basevalue*value*lvl
            //            basevalue=xxxxx
            value = 0.1;
            name = "t6";
            position = 6;
        }
    }
}