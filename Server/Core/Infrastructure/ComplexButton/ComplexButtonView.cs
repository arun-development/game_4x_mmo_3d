using System.Collections.Generic;

namespace Server.Core.Infrastructure.ComplexButton
{
    public class ComplexButtonView
    {
        //public const string ComplexBtn = Directories.Template + "_complexButton.cshtml";
        public List<SectionItem> Collection { get; set; }
        public bool IsNewItem { get; set; }

        public void Full(SectionContentViewData d)
        {
            d.Left.BorderAnimView(SectionItem.Ms);
            d.Centr.BorderAnimView(SectionItem.Center);
            d.Right.BorderAnimView(SectionItem.Ms);
            Collection = new List<SectionItem>
            {
                d.Left,
                d.Centr,
                d.Right
            };
        }


        public ComplexButtonView OnlyCentr(string path, object data)
        {
            var left = new SectionItem();
            left.BorderAnimView(SectionItem.Ms);
            var centr = new SectionItem();
            centr.BorderAnimView(SectionItem.Center, path, data);
            var right = new SectionItem();
            right.BorderAnimView(SectionItem.Ms);

            Collection = new List<SectionItem>
            {
                left,
                centr,
                right
            };
            return this;
        }

        public ComplexButtonView SimpleCentr(string path, string name)
        {
            return OnlyCentr(path, new { Head = name });
        }
    }
}
