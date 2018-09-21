/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.skagry.Areas.skagry.Cls.TestObserver
{
    public class IndustrialComplex : IObservable<Memory>
    {
        private double eRate;

        private List<IObserver<Memory>> observers;

        public double ERate
        {
            get
            {
                return eRate;
            }

            set
            {
                eRate = value;
                Notify(new Memory(eRate));
            }
        }

        public IndustrialComplex()
        {
            observers = new List<IObserver<Memory>>();
        }

        public IDisposable Subscribe(IObserver<Memory> observer)
        {

            if (!observers.Contains(observer))
                observers.Add(observer);

            return new Unsubscriber(observers, observer);
        }

        private class Unsubscriber : IDisposable
        {
            private List<IObserver<Memory>> _observers;
            private IObserver<Memory> _observer;

            public Unsubscriber(List<IObserver<Memory>> observers, IObserver<Memory> observer)
            {
                this._observers = observers;
                this._observer = observer;
            }

            public void Dispose()
            {
                if (_observer != null && _observers.Contains(_observer))
                    _observers.Remove(_observer);
            }
        }

        public void Notify(Nullable<Memory> loc)
        {
            foreach (var observer in observers)
            {
                if (loc.HasValue)
                    observer.OnNext(loc.Value);
            }
        }


    }
}
*/