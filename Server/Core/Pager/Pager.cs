using System;

namespace Server.Core.Pager
{
    public class Pager
    {
        public int Page { get; set; } // номер текущей страницы
        public int PageSize { get; set; } // кол-во объектов на странице
        public int Items { get; set; } // всего объектов
        public int LinkCount { get; set; }

        public int Pages => (int)Math.Ceiling((decimal)Items / PageSize); // всего страниц

        public int StartPage
        {
            get
            {
                int num;

                if (Pages < (Page - LinkCount / 2)) num = Pages - LinkCount;
                else num = (int)Math.Ceiling((decimal)Page - LinkCount / 2); //-V3041

                if (num < 1) num = 1;
                return num;
            }
        }
    }


    public class DataPager
    {

        public int TotalCount { get; set; }
        public int Take { get; set; }  
        public int Skip { get; set; }  
        public int FirstId { get; set; }  
        public int LasId { get; set; }  

    }

    public static class PagerDefaults
    {
        public const int MaxItemInStack = 6;
        public const int MaxItemInUserRatting = 50;
        public const int MaxItemInAlliance = 50;


        //    public int Page { get; set; } // номер текущей страницы
        //public int PageSize { get; set; } // кол-во объектов на странице
        //public int Items { get; set; } // всего объектов
        //public int LinkCount { get; set; }

        //public int Pages // всего страниц
        //    => (int) Math.Ceiling((decimal) Items/PageSize);

        //public int StartPage
        //{
        //    get
        //    {
        //        int num;

        //        if (Pages < (Page - LinkCount/2))
        //        {
        //            num = Pages - LinkCount;
        //        }
        //        else
        //        {
        //            num = (int) Math.Ceiling((decimal) Page - LinkCount/2);
        //        }

        //        if (num < 1)
        //        {
        //            num = 1;
        //        }

        //        return num;
        //    }
        //}
    }
}