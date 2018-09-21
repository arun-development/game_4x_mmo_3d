namespace Server.Services.GameObjects.Cls.Mods.Tech
{
    public class HpFleet:AbstractTech
    {
        public HpFleet()
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
            name = "t8";
            position = 8;


            //Bild.Labortory
            depends.Add(new
            {
                name = "namespase.classNam2",
                level = 1
            });
        }
    }
}