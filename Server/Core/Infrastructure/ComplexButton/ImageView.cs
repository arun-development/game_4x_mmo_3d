namespace Server.Core.Infrastructure.ComplexButton
{
    public class ImageView //: SectionContentViewData
    {
        public string ImagePathOrCss { get; set; }
        public string Alt { get; set; }
        public string Title { get; set; }
        public bool IsImage { get; set; }


        public static ImageView Img(string pathOrCss, string title = null, bool isImage = false, string alt = null)
        {
            var image = new ImageView
            {
                ImagePathOrCss = pathOrCss,
                IsImage = isImage
            };

            if (title != null)
            {
                image.Title = title;
            }
            if (alt != null)
            {
                image.Alt = alt;
            }
            return image;
        }
    }
}