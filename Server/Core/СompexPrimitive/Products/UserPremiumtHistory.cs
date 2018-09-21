namespace Server.Core.СompexPrimitive.Products
{
    public class UserPremiumtHistory
    {
        public int Duration;
        public int DateActivate;
        public int DateEndTime;

        public UserPremiumtHistory()
        {
        }
        public UserPremiumtHistory(int duration, int dateActivate)
        {
            Duration = duration;
            DateActivate = dateActivate;
            DateEndTime = dateActivate+ duration;
        }
    }
}