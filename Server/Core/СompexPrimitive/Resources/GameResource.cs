using System;

namespace Server.Core.СompexPrimitive.Resources
{
    public class GameResource : MaterialResource
    {
        public int TimeProduction;
        public double Cc;

        public GameResource()
        {
        }
        public GameResource(double? e = null, double? ir = null, double? dm = null):base(e,ir,dm)
        {
        }

        public new void Multiply(double multiply)
        {
            base.Multiply(multiply);
            TimeProduction = (int)Math.Floor(TimeProduction * multiply);
            Cc *= multiply;
        }
        public   void MultiplyBase(double multiply)
        {
            base.Multiply(multiply);
 
        }

        public void Multiply(GameResource multiply, double timeProductionMultiply)
        {
            base.Multiply((MaterialResource)multiply);
            TimeProduction = (int)Math.Floor(TimeProduction * timeProductionMultiply);
            Cc *= multiply.Cc;
        }

        public static GameResource BaseProportion => new GameResource
        {
            E = 1,
            Ir = (double) 1/2,
            Dm = (double) 1/5,
            Cc = 10
        };
    }
}