using System.Collections.Generic;
using System.Linq;
using Server.DataLayer;

namespace Server.Core.СompexPrimitive.Products
{
    public class UserPremiumWorkModel : UserPremiumDataModel
    {
        public int UserId;

        public UserPremiumWorkModel(UserPremiumDataModel parent)
        {
            UserId = parent.Id;
            EndTime = parent.EndTime;
            AutoPay = parent.AutoPay;
            Finished = parent.Finished;
            Data = parent.Data;
        }
        private TimeLineStatus _timeLineStatus;
        public bool IsActive => !Finished;
        public TimeLineStatus TimeLineStatus => _timeLineStatus ?? (_timeLineStatus = GetPemiumTimeLine(this));

        public static TimeLineStatus GetPemiumTimeLine(UserPremiumDataModel userUserPremium)
        {
            if (userUserPremium?.Data == null || !userUserPremium.Data.Any())
            {
                return null;
            }

            var pd = userUserPremium.Data.OrderBy(i => i.Value.DateActivate);
            var timeLine = new List<TimeLine>();
            var curTime = UnixTime.UtcNow();
            timeLine.AddRange(pd.Select(i => new TimeLine
            {
                StartTime = i.Value.DateActivate,
                EndTime = i.Value.DateEndTime,
                ActiveStatus =  i.Value.DateEndTime <= curTime
            }));
            if (!timeLine.Any()) return null;
           var  premiumTimeLineStatus = new TimeLineStatus
            {
                Status = new List<bool>(),
                Points = new List<int>()
            };

            var e = new TimeLine();

            for (var i = 0; i < timeLine.Count; i++)
            {
                if (i == 0)
                {
                    e = timeLine[i];
                    premiumTimeLineStatus.Add(timeLine[i].StartTime, true);
                    continue;
                }

                if (e.EndTime < timeLine[i].StartTime)
                {
                    premiumTimeLineStatus.Add(e.EndTime, false);
                    premiumTimeLineStatus.Add(timeLine[i].StartTime, true);
 
                }

                e = timeLine[i];
            }
            premiumTimeLineStatus.Add(e.EndTime, e.EndTime >= curTime);
 
            return premiumTimeLineStatus;
        }

    }
}
