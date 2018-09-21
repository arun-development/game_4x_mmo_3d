namespace Server.Core.Interfaces
{
    public interface ICreateNew<T>
    {
        T CreateNew(T other);
        T CreateNewFromThis();

    }
}
