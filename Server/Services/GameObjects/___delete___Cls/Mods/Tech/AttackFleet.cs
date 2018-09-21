namespace Server.Services.GameObjects.Cls.Mods.Tech
{
    public class AttackFleet:AbstractTech
    {
        public AttackFleet()
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
            name = "t7";
            position = 7;
        }
    }
}