using System;
using Server.Extensions;

namespace Server.Core.СompexPrimitive
{
    public class Vector3
    {
        public const int PositionMaxLength = 100;

        public static readonly Vector3 Zero = new Vector3(0, 0, 0);


        public Vector3()
        {
        }

        public Vector3(double? x = null, double? y = null, double? z = null)
        {
            X = x ?? 0.0;
            Y = y ?? 0.0;
            Z = z ?? 0.0;
        }

        public double X { get; set; }

        public double Y { get; set; }

        public double Z { get; set; }


        public void Calc(Vector3 otherVector, string operation)
        {
            X = CalcVector(X, otherVector.X, operation);
            Y = CalcVector(Y, otherVector.Y, operation);
            Z = CalcVector(Z, otherVector.Z, operation);
        }

        private static double CalcVector(double firstPoint, double secondPoint, string operation)
        {
            return CustomExtentions.Operation(firstPoint, secondPoint, operation);
        }

        private static Vector3 CalcVector(Vector3 firstPoint, Vector3 secondPoint, string operation)
        {
            return new Vector3
            {
                X = CalcVector(firstPoint.X, secondPoint.X, operation),
                Y = CalcVector(firstPoint.Y, secondPoint.Y, operation),
                Z = CalcVector(firstPoint.Z, secondPoint.Z, operation)
            };
        }

        public static Vector3 CalcVectorDistance(Vector3 startPoint, Vector3 endPoint)
        {
            return CalcVector(startPoint, endPoint, "-");
        }

        public static Vector3 Add(Vector3 startPoint, Vector3 endPoint)
        {
            return CalcVector(startPoint, endPoint, "+");
        }

        public static Vector3 Pow(Vector3 source, double val)
        {
            source.X = Math.Pow(source.X, val);
            source.Y = Math.Pow(source.Y, val);
            source.Z = Math.Pow(source.Z, val);
            return source;
        }

        public static double SumPow(Vector3 source, double val)
        {
            return Math.Pow(source.X + source.Y + source.Z, val);
        }

        public static double CalcDistance(Vector3 startPoint, Vector3 endPoint)
        {
            return SumPow(Pow(CalcVectorDistance(startPoint, endPoint), 2), 0.5);
        }
    }
}