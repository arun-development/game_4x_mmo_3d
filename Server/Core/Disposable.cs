using System;

namespace Server.Core
{
    public class Disposable : IDisposable
    {
        protected bool _isDisposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~Disposable()
        {
            Dispose(false);
        }

        private void Dispose(bool disposing)
        {
            if (!_isDisposed && disposing) DisposeCore();
            _isDisposed = true;
        }

        protected virtual void DisposeCore()
        {
        }
    }
}