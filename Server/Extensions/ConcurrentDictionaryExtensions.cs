using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace Server.Extensions
{
    public static class ConcurrentDictionaryExtensions
    {
        public static TValue GetOrAddLazy<TKey, TValue>(this ConcurrentDictionary<TKey, Lazy<TValue>> @this, TKey key,
            Func<TKey, TValue> valueFactory)
        {
            return
                @this.GetOrAdd(key,
                    (k) => new Lazy<TValue>(() => valueFactory(k), LazyThreadSafetyMode.ExecutionAndPublication)).Value;
        }

        public static TValue AddOrUpdateLazy<TKey, TValue>(this ConcurrentDictionary<TKey, Lazy<TValue>> @this,
            TKey key, Func<TKey, TValue> addValueFactory, Func<TKey, TValue, TValue> updateValueFactory)
        {
            return @this.AddOrUpdate(key, k => new Lazy<TValue>(
                () => addValueFactory(k), LazyThreadSafetyMode.ExecutionAndPublication),
                (k, oldValue) => new Lazy<TValue>(() => updateValueFactory(k, oldValue.Value), LazyThreadSafetyMode.ExecutionAndPublication)).Value;
        }

        //return  dictionary.AddOrUpdate(key, value, (oldkey, oldvalue) => value);
        public static bool TryGetValueLazy<TKey, TValue>(this ConcurrentDictionary<TKey, Lazy<TValue>> @this, TKey key,
            out TValue value)
        {
            value = default(TValue);
            if (@this == null) return false;
            Lazy<TValue> v;

            var result = @this.TryGetValue(key, out v);
            if (result) value = v.Value;
            return result;
        }

        // this overload may not make sense to use when you want to avoid
        //  the construction of the value when it isn't needed
        public static bool TryAddLazy<TKey, TValue>(this ConcurrentDictionary<TKey, Lazy<TValue>> @this, TKey key,
            TValue value)
        {
            return @this.TryAdd(key, new Lazy<TValue>(() => value));
        }

        public static bool TryAddLazy<TKey, TValue>(this ConcurrentDictionary<TKey, Lazy<TValue>> @this, TKey key,
            Func<TKey, TValue> valueFactory)
        {
            return @this.TryAdd(key,
                new Lazy<TValue>(() => valueFactory(key), LazyThreadSafetyMode.ExecutionAndPublication));
        }

        public static bool TryRemoveLazy<TKey, TValue>(this ConcurrentDictionary<TKey, Lazy<TValue>> @this, TKey key,
            out TValue oldValue)
        {
            oldValue = default(TValue);
            Lazy<TValue> v;
            if (!@this.TryRemove(key, out v)) return false;
            oldValue = v.Value;
            return true;
        }

        public static bool TryUpdateLazy<TKey, TValue>(this ConcurrentDictionary<TKey, Lazy<TValue>> @this, TKey key,
            Func<TKey, TValue, TValue> updateValueFactory)
        {
            Lazy<TValue> oldValue;
            if (!@this.TryGetValue(key, out oldValue)) return false;
            return @this.TryUpdate(key,
                new Lazy<TValue>(() => updateValueFactory(key, oldValue.Value),
                    LazyThreadSafetyMode.ExecutionAndPublication), oldValue);
        }

        public static int GetCount<TKey, TValue>(this ConcurrentDictionary<TKey, TValue> @this)
        {
            if (@this == null)
            {
                return 0;
            }
            return @this.Select(i => i.Key).Count();


        }
        public static List<TKey> GetKeys<TKey, TValue>(this ConcurrentDictionary<TKey, TValue> @this)
        {
            return @this?.Select(i => i.Key).ToList();
        }

        public static bool TryRemoveSimple<TKey, TValue>(this ConcurrentDictionary<TKey, TValue> @this, TKey key)
        {
            TValue value;
            return @this.TryRemove(key, out value);
        }
    }
}