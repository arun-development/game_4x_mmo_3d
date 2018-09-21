using System;

namespace Server.DataLayer
{
    public interface IDisposableData : IDisposable
    {
        bool IsDisposed { get; }
    }
}