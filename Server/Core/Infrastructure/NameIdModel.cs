using Server.DataLayer;

namespace Server.Core.Infrastructure
{

    public interface INameIdModel<T>: IUniqueIdElement<T>, INameProperty where T : struct
    {
    }

    public class NameIdModel<T> : INameIdModel<T> where T : struct
    {
        public T Id { get; set; }
        public string Name { get; set; }
        public NameIdModel()
        {

        }
        public NameIdModel(T id, string name)
        {
            Id = id;
            Name = name;
        }
    }

    public class NameIdInt : NameIdModel<int>
    {

        public NameIdInt()
        {
        }
        public NameIdInt(int id, string name) : base(id, name)
        {
        }

    }
    public class NameIdLong : NameIdModel<long>
    {
        public NameIdLong()
        {
        }
        public NameIdLong(long id, string name) : base(id, name)
        {
           
        }
    }
    public class NameIdByte : NameIdModel<byte>
    {
        public NameIdByte()
        {
        }
        public NameIdByte(byte id, string name) : base(id, name)
        {
        }
    }
}
