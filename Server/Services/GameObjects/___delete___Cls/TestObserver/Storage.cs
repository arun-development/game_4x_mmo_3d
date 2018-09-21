/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.skagry.Areas.skagry.Cls.TestObserver
{
    public class Storage : IObserver<Memory>
    {
        private int number;
        private IDisposable unsubscriber;

        public Storage(int number)
        {
            this.number = number;
        }

        public void Subscribe(IObservable<Memory> provider)
        {
            if (provider != null)
                unsubscriber = provider.Subscribe(this);
        }

        public int GetNumber()
        {
            return number;
        }

        public void OnCompleted()
        {
            //throw new NotImplementedException();
        }

        public void OnError(Exception error)
        {
            throw new NotImplementedException();
        }

        public void OnNext(Memory value)
        {
            // job
        }

        public virtual void Unsubscribe()
        {
            unsubscriber.Dispose();
        }
    }
}
*/