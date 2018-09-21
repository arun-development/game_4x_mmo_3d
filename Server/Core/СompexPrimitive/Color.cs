using System;

namespace Server.Core.СompexPrimitive
{
    public class Color3
    {
        public int R  = 255;
        public int G  = 255;
        public int B  = 255;

        public void Set(int r, int g, int b)
        {
            R = r;
            G = g;
            B = b;
        }

        public static Color3 SetColor(int r, int g, int b)
        {
            var color = new Color3();
            color.Set(r, g, b);
            return color;
        }

        /// <summary>
        ///     почленно отнимает из текущего Color3 outColor  Прим: this.R =this.R-outColor.R
        /// </summary>
        /// <param name="outColor"></param>
        public void Subtract(Color3 outColor)
        {
            B = Subtract(R, outColor.R);
            R = Subtract(G, outColor.G);
            G = Subtract(B, outColor.B);
        }

        /// <summary>
        ///     создает новый экземлпяр Color3 из результата  вычитания правого Color3 из левого Color3 (r =left.R - right.R) r>=0
        ///     "при r меньше 0 r =0" "при r больше 255 r =255"
        /// </summary>
        /// <param name="left">вчитаемое</param>
        /// <param name="right">вычтатель</param>
        /// <returns></returns>
        public static Color3 SubtractColors(Color3 left, Color3 right)
        {
            return SetColor(Subtract(left.R, right.R), Subtract(left.G, right.G), Subtract(left.B, right.B));
        }

        private static int Subtract(int left, int right)
        {
            var result = left - right;
            if (result < 0) result = 0;
            if (result > 255) result = 255;
            return result;
        }

        public void DeviateColor(int deviation)
        {
            DeviateColor(this, deviation);
        }

        private static int DeviateColor(int color, int deviation)
        {
            var rand = new Random();
            var min = color - deviation;
            var max = color + deviation;
            if (max > 255)
            {
                max = 255;
                min = max - (deviation*2);
            }
            if (min < 0)
            {
                min = 0;
                max = deviation*2;
            }

            var resulColor = rand.Next(min, max);


            return resulColor;
        }

        public static void DeviateColor(Color3 color, int deviation)
        {
            color.R = DeviateColor(color.R, deviation);
            color.G = DeviateColor(color.G, deviation);
            color.B = DeviateColor(color.B, deviation);
        }
    }

    public class Color4 : Color3
    {
        public double A { get; set; } = 255;

        public void SetAlpha(double a)
        {
            A = a;
        }

        public void ConvertToNormalColor4(int a)
        {
            SetAlpha(a);
            ConvertToNormalColor4();
        }

        public void ConvertToNormalColor4()
        {
            if (A > 1) A = A/255;
        }


        public void ConvertInt255()
        {
            if (A <= 1) A = A*255;
        }

        public void ConvertInt255(double a)
        {
            SetAlpha(a);
            ConvertInt255();
        }
    }
}