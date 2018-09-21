using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
//using System.Drawing;
//using System.Drawing.Drawing2D;
//using System.Drawing.Imaging;


namespace Server.ServicesConnected.AzureStorageServices.ImageService

{
    public class ImageConfig
    {
        public int MaxWidth { get; set; }
        public int MaxHeight { get; set; }
    }

    public class ImageTypes
    {
        public static Image Base64ToImage(string base64String)
        {
            return Image.FromStream(Base64ToStream(base64String), true);
        }

        public static Stream Base64ToStream(string base64String)
        {
            // Convert base 64 string to byte[]
            var imageBytes = Convert.FromBase64String(base64String);
            // Convert byte[] to Image
            return new MemoryStream(imageBytes, 0, imageBytes.Length);
        }

        public static MemoryStream ImageToStream(Image img, ImageFormat format)
        {
            var ms = new MemoryStream();
   
            img.Save(ms, format);
            ms.Position = 0;
            return ms;
        }

        public static async Task<Image> ToMap(string sourceBase64)
        {
            return await Task.Run(() => Base64ToImage(sourceBase64));
        }

        public static class CaruselImage
        {
            public const string Normal = "Carusel";
            public const string Min = "CaruselMin";
        }
    }


    public class ImageResizer
    {
        private Rectangle Rectangle { get; set; }
        private Image Image { get; set; }

        public static void ResizeImage(string fromPath, string toPath, string type = null, ImageConfig config = null)
        {
            var maxWidth = 0;
            var maxHeight = 0;

            if (type == ImageTypes.CaruselImage.Min)
            {
                maxWidth = 191;
                maxHeight = 107;
            }
            if (type == ImageTypes.CaruselImage.Normal)
            {
                maxWidth = 1300;
                maxHeight = 728;
            }
            if (config != null)
            {
                maxWidth = config.MaxWidth;
                maxHeight = config.MaxHeight;
            }
            using (var originalPic = new Bitmap(fromPath, false))
            {
                // Вычисление новых размеров картинки
                var width = originalPic.Width; //текущая ширина
                var height = originalPic.Height; //текущая высота
                double widthDiff = (width - maxWidth); //разница с допустимой шириной
                double heightDiff = (height - maxHeight); //разница с допустимой высотой

                // Определение размеров, которые необходимо изменять
                var doWidthResize = (maxWidth > 0 && width > maxWidth && widthDiff > -1 && widthDiff > heightDiff);
                var doHeightResize = (maxHeight > 0 && height > maxHeight && heightDiff > -1 && heightDiff > widthDiff);

                // Ресайз картинки
                if (doWidthResize || doHeightResize || (width.Equals(height) && widthDiff.Equals(heightDiff)))
                {
                    int iStart;
                    decimal divider;
                    if (doWidthResize)
                    {
                        iStart = width;
                        divider = Math.Abs((decimal) iStart/maxWidth);
                        height = (int) Math.Round((height/divider));
                        width = maxWidth;
                    }
                    else
                    {
                        iStart = height;
                        divider = Math.Abs((decimal) iStart/maxHeight);
                        height = maxHeight;
                        width = (int) Math.Round((width/divider));
                    }
                }

                // Сохраняем файл в папку пользователя
                using (var newImage = new Bitmap(originalPic, width, height))
                {
                    using (var oGraphics = Graphics.FromImage(newImage))
                    {
                        oGraphics.SmoothingMode = SmoothingMode.AntiAlias;
                        oGraphics.InterpolationMode = InterpolationMode.Default;
                        oGraphics.DrawImage(originalPic, 0, 0, width, height);

                        SaveToDirectory(toPath, newImage);
                    }
                }
            }
        }

        public static async Task<Image> ToSquare(Image source, int side)
        {
            return await Task.Run(() => new ImageResizer().ResizeImage(source, new RectangleF(0, 0, side, side)));
        }

        private static void SaveToDirectory(string toPath, Bitmap newImage)
        {
            if (File.Exists(toPath))File.Delete(toPath);
            newImage.Save(toPath);
        }

        public void PacketResizeDirectorySetPostfix(string srcDirectory, Dictionary<string, ImageConfig> postfixConfig,
            string toPath = "")
        {
            var targetDir = srcDirectory + "result/";

            var origFileList = Directory.GetFiles(srcDirectory.Substring(0, srcDirectory.Length - 1));

            var fileListNames = origFileList.Select(Path.GetFileName).ToList();


            if (toPath != "")
            {
                targetDir = toPath;
            }


            var workCollection = new List<WorkItem>();
            foreach (var i in fileListNames)
            {
                var itemName = i.Substring(0, i.Length - 4);
                var ext = i.Substring(i.Length - 4);

                workCollection.AddRange(from k in postfixConfig
                    let prefTo = targetDir + itemName
                    select new WorkItem
                    {
                        MaxWidth = k.Value.MaxWidth,
                        MaxHeight = k.Value.MaxHeight,
                        FromPath = srcDirectory + i,
                        ToPath = prefTo + k.Key + ext
                    });
            }


            foreach (var i in workCollection)
            {
                Image = new Bitmap(i.FromPath);
                CalculateRectangle(i);
            }
        }


        private void CalculateRectangle(WorkItem imgConf)
        {
            var image = Image;


            var originalWidth = image.Width;
            var originalHeight = image.Height;

            var configWidth = imgConf.MaxWidth;
            var configHeight = imgConf.MaxHeight;

            var widthCalculated = (originalWidth*configHeight)/originalHeight;
            var heightCalculated = (originalHeight*configWidth)/originalWidth;

            var width = configWidth;
            var height = configHeight;

            var x = 0;
            var y = 0;

            var widthFromBitmap = configWidth;
            var heightFromBitmap = configHeight;

            if (widthCalculated < configWidth)
            {
                heightFromBitmap = heightCalculated;
                y = (heightFromBitmap - height)/2;
            }

            if (heightCalculated < configHeight)
            {
                widthFromBitmap = widthCalculated;
                x = (widthFromBitmap - width)/2;
            }
            var bitmap = new Bitmap(image, widthFromBitmap, heightFromBitmap);
            var graph = Graphics.FromImage(bitmap);
            graph.SmoothingMode = SmoothingMode.HighQuality;
            graph.InterpolationMode = InterpolationMode.HighQualityBicubic;
            var result = CropBitmap(bitmap, x, y, width, height);

            var graph2 = Graphics.FromImage(result);
            graph2.SmoothingMode = SmoothingMode.HighQuality;
            graph2.InterpolationMode = InterpolationMode.HighQualityBicubic;


            result.Save(imgConf.ToPath);
        }


        public Image ResizeImage(Image source, RectangleF destinationBounds)
        {
            var sourceBounds = new RectangleF(0.0f, 0.0f, source.Width, source.Height);
            //var scaleBounds = new RectangleF();

            float resizeRatio;
            var sourceRatio = source.Width/(float) source.Height;

            if (Math.Abs(source.Width - destinationBounds.Width) < 0.01 &&
                Math.Abs(source.Height - destinationBounds.Height) < 0.01)
                return (Image) source;
            
            Image destinationImage = new Bitmap((int) destinationBounds.Width, (int) destinationBounds.Height);
            var graph = Graphics.FromImage(destinationImage);
            graph.InterpolationMode = InterpolationMode.HighQualityBicubic;

            // Fill with background color
 
            // todo  кривая ссылка на циклическую библиотку
       //     graph.FillRectangle(new SolidBrush(new Color()));
           // graph.FillRectangle(new SolidBrush((System.Drawing.)Color.White), destinationBounds);

            if (sourceRatio >= 1.0f)
            {
                //landscape
                resizeRatio = destinationBounds.Width/sourceBounds.Width;
                var scaleHeight = sourceBounds.Height*resizeRatio;
                var trimValue = destinationBounds.Height - scaleHeight;
                graph.DrawImage(source, 0, (trimValue/2), destinationBounds.Width, scaleHeight);
            }

            else
            {
                //portrait
                resizeRatio = destinationBounds.Height/sourceBounds.Height;
                var scaleWidth = sourceBounds.Width*resizeRatio;
                var trimValue = destinationBounds.Width - scaleWidth;
                graph.DrawImage(source, (trimValue/2), 0, scaleWidth, destinationBounds.Height);
            }

            return destinationImage;
        }


        public Bitmap CropBitmap(Bitmap bitmap, int cropX, int cropY, int cropWidth, int cropHeight)
        {
            var rect = new Rectangle(cropX, cropY, cropWidth, cropHeight);
            //Bitmap cropped = bitmap.Clone(rect, bitmap.PixelFormat);
            var cropped = bitmap.Clone(rect, bitmap.PixelFormat);
            return cropped;
        }

        private class WorkItem
        {
            public string FromPath { get; set; }
            public string ToPath { get; set; }
            public int MaxWidth { get; set; }
            public int MaxHeight { get; set; }
        }
    }
}