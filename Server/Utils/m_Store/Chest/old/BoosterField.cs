using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace site.Models.User.Chest
{

    public class BoosterField
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int StoreProductId { get; set; }
        public int UserChestId { get; set; }
        public int BasicDuration { get; set; }
        public string Property { get; set; }
        public string AdvancedImgUrls { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool Finished { get; set; }
    }
}