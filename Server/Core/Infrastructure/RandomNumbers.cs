using System;

namespace Server.Core.Infrastructure
{
    public class RandomNumbers : Random
    {
        public RandomNumbers() : base() { }

        public double NextDouble(double minimum, double maximum)
        {
           
            return base.NextDouble() * (maximum - minimum) + minimum;
        }
    }
}
