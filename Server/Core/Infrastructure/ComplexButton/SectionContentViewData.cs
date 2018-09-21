namespace Server.Core.Infrastructure.ComplexButton
{

    public class SectionContentViewData
    {

        public SectionItem Centr;

        public SectionItem Left;

        public SectionItem Right;
    }

    public class SectionItem
    {
        public const string Ms = "ms";
        public const string Center = "center";

        public object Data { get; set; }
        public string Path { get; set; }
        public bool IsPath { get; set; }
        public string Size { get; set; }
        public string ItemId { get; set; }
        public string JsFunction { get; set; }
        public bool IsComplexPart { get; set; }

        public void BorderAnimView(string size, string path = null, object data = null)
        {
            Size = size;


            if (path != null)
            {
                Path = path;
                IsPath = true;
            }
            else
            {
                IsPath = (Path != null) && IsPath;
            }

            if (data != null)
            {
                Data = data;
            }

            //ComplexButtonView
        }
    }
}