using System.Collections.Generic;

namespace Server.Core.СompexPrimitive.Products
{
    public class TimeLineStatus
    {
        public List<int> Points;
        public List<bool> Status;

        public void Add(int point, bool status)
        {
            Points.Add(point);
            Status.Add(status);
        }
    }
}