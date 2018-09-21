using System.Collections.Generic;

namespace Server.Core.Map.Structure
{
    public abstract class StarTypes
    {
        // положительные
        protected const string O = "O";
        protected const string B = "B";
        protected const string A = "A";
        protected const string F = "F";

        // Отрицательные           
        protected const string G = "G";
        protected const string K = "K";
        protected const string M = "M";
        protected const string L = "L";
    }

    public class StarEnergyBonus : StarTypes
    {
        public StarEnergyBonus()
        {
            StarTypeCollection = new Dictionary<string, StarEnergyRange>
            {
                {O, new StarEnergyRange {Min = 3, Max = 4}},
                {B, new StarEnergyRange {Min = 2, Max = 3}},
                {A, new StarEnergyRange {Min = 1, Max = 2}},
                {F, new StarEnergyRange {Min = 0, Max = 1}},
                {G, new StarEnergyRange {Min = -1, Max = 0}},
                {K, new StarEnergyRange {Min = -2, Max = -1}},
                {M, new StarEnergyRange {Min = -3, Max = -2}},
                {L, new StarEnergyRange {Min = -4, Max = -3}}
            };
        }

        public Dictionary<string, StarEnergyRange> StarTypeCollection { get; set; }
    }

    public class StarEnergyRange
    {
        public int Min;
        public int Max;
    }
}