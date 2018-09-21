namespace Server.Core.СompexPrimitive.Resources
{
    public class ExtractionResource
    {
        public MaterialResource ExtractionPerHour;
        public MaterialResource ExtractionProportin;

        public void SetAndCalcEmpFromProportion(MaterialResource extractionProportin, double calculatedPower, double baseIr, double baseDm)
        {
            ExtractionProportin = extractionProportin;
            ExtractionPerHour = CalculateExtractionPerHouer(extractionProportin, calculatedPower, baseIr, baseDm);

        }

        public static MaterialResource CalculateExtractionPerHouer(MaterialResource extractionProportin, 
            double calculatedPower, double baseIr, double baseDm)
        {
 
            var valE = calculatedPower * extractionProportin.E / 100;
            var valIr = (calculatedPower * extractionProportin.Ir / 100) / baseIr;
            var valDm = (calculatedPower * extractionProportin.Dm / 100) / baseDm;
            return new MaterialResource(valE, valIr, valDm);
        }
        public static MaterialResource CalcExtractionPerSecond(MaterialResource extractionProportin, double calculatedPower, double baseIr, double baseDm)
        {
            var factor = UnixTime.OneHourInSecond;
            var rph = CalculateExtractionPerHouer(extractionProportin, calculatedPower,  baseIr,  baseDm);
            rph.Multiply((double)1 / factor);
            return rph;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="extractionProportin"></param>
        /// <param name="calculatedPower"></param>
        /// <param name="second"></param>
        /// <param name="baseIr">ExtractionModule.BaseProportion.Ir</param>
        /// <param name="baseDm">ExtractionModule.BaseProportion.Dm</param>
        /// <returns></returns>
        public static MaterialResource CalculateExtractionBySeconds(MaterialResource extractionProportin, double calculatedPower, int second, double baseIr, double baseDm)
        {
            var eps = CalcExtractionPerSecond(extractionProportin, calculatedPower, baseIr, baseDm);
            eps.Multiply(second);
            return eps;
        }


    }
}