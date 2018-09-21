using Server.Core.Interfaces;

namespace Server.Core.СompexPrimitive.Units
{
    public class Navigation: ICreateNew<Navigation>
    {
        public Navigation(int navigationTime)
        {
            NavigationTime = navigationTime;
 
        }

        public int NavigationTime { get; set; }
 

 

        public Navigation CreateNew(Navigation other)
        {
            return new Navigation(other.NavigationTime);
        }

        public Navigation CreateNewFromThis()
        {
            return new Navigation(NavigationTime);
        }
 

    }
}