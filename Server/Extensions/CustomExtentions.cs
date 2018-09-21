using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Server.Core.СompexPrimitive;

namespace Server.Extensions {
    [ComVisible(true)]
    public static class CustomExtentions {
        public static TResult ToSpecificModel<TResult>(this string fromData) where TResult : new() {
            if (string.IsNullOrEmpty(fromData)) {
                return default(TResult);
            }
            var baseType = typeof(TResult).BaseType;
            if (baseType == null) {
                return default(TResult);
            }
            if (baseType.IsValueType) {
                return (TResult) Convert.ChangeType(fromData, baseType);
            }
            return JsonConvert.DeserializeObject<TResult>(fromData);
        }


        public static string ToSerealizeString(this object fromData) {
            return fromData == null ? "" : JsonConvert.SerializeObject(fromData);
        }

        public static string FirstToUpper(this string str) {
            if (string.IsNullOrWhiteSpace(str)) {
                return str;
            }
            return char.ToUpper(str[0]) + str.Substring(1);
        }
        public static string FirstToLower(this string str)
        {
            if (string.IsNullOrWhiteSpace(str))
            {
                return str;
            }
            return char.ToLower(str[0]) + str.Substring(1);
        }

        public static T CloneDeep<T>(this T source) where T : new() {
            if (source == null) {
                return new T();
            }
            var serialized = source.ToSerealizeString();

            var cloned = JsonConvert.DeserializeObject<T>(serialized);


            return cloned;
        }

        public static string RemoveLastSimbol(this string str)
        {
            if (string.IsNullOrWhiteSpace(str) || str.Length<=1)
            {
                return "";

            }
            return str.Substring(0, str.Length - 1);
        }

        public static Dictionary<string, object> ObjectToDictionary(this object myObj) {
            return myObj.GetType()
                .GetProperties()
                .Select(pi => new {pi.Name, Value = pi.GetValue(myObj, null)})
                .Union(
                    myObj.GetType()
                        .GetFields()
                        .Select(fi => new {fi.Name, Value = fi.GetValue(myObj)})
                )
                .ToDictionary(ks => ks.Name, vs => vs.Value);
        }

        public static T ToObject<T>(this IDictionary<string, object> source) where T : class, new() {
            var someObject = new T();
            var someObjectType = someObject.GetType();

            foreach (var item in source) {
                someObjectType.GetProperty(item.Key)?.SetValue(someObject, item.Value, null);
            }
            return someObject;
        }

        public static double Operation(double sourceVal, double targetVal, string operation)
            //  string Operator, Number1 , Number2 )

        {
            switch (operation) {
                case "+":
                    return sourceVal + targetVal;
                case "-":
                    return sourceVal - targetVal;
                case "*":
                    return sourceVal * targetVal;
                case "/":
                    return sourceVal / targetVal;
                case "1/":
                    return targetVal / sourceVal;
            }
            throw new Exception("Operator not exist");
        }


        /// <summary>
        ///     Performs a shallow convert from the parent to the child object.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="U"></typeparam>
        /// <param name="parent">The parent.</param>
        /// <param name="child">The child.</param>
        public static void ShallowConvert<T, U>(this T parent, U child) {
            foreach (var property in parent.GetType().GetProperties().Where(property => property.CanWrite)) {
                property.SetValue(child, property.GetValue(parent, null), null);
            }
        }

        //Either Add or overwrite
        public static TV AddOrUpdateSimple<TK, TV>(this ConcurrentDictionary<TK, TV> dictionary, TK key, TV value) {
            return dictionary.AddOrUpdate(key, value, (_key, oldvalue) => value);
        }


        public static bool TryUpdateKey<TK, TV>(this ConcurrentDictionary<TK, TV> dictionary, TK oldKey, TK newKey,
            out TV resultVal) {
            return dictionary.TryRemove(oldKey, out resultVal) && dictionary.TryAdd(newKey, resultVal);
        }


        public static async Task PagerActionAsync<TSource>(this IList<TSource> source, int perPage,
            Func<IList<TSource>, Task<IList<TSource>>> taskPerPAge,
            Action<IList<TSource>> actionOnTaskComplete = null) {
            var total = source.Count;
            var pages = (int) Math.Ceiling((double) total / perPage);

            for (var i = 0; i < pages; i++) {
                var result = await taskPerPAge(source.Skip(i * perPage).Take(perPage).ToList());
                actionOnTaskComplete?.Invoke(result);
            }
        }

        public static void PagerAction<TSource>(this IList<TSource> source, int perPage,
            Func<IList<TSource>, IList<TSource>> perPageAction, Action<IList<TSource>> actionOnTaskComplete = null) {
            var total = source.Count;
            var pages = (int) Math.Ceiling((double) total / perPage);

            for (var i = 0; i < pages; i++) {
                var result = perPageAction(source.Skip(i * perPage).Take(perPage).ToList());
                actionOnTaskComplete?.Invoke(result);
            }
        }


        public static T ObjectToType<T>(this object obj) {
            if (obj == null) {
                return default(T);
            }
            if (obj.GetType() == typeof(T)) {
                return (T) obj;
            }
            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(obj));
        }

        public static int ToTimestamp(this DateTime dateTime)
        {
            return UnixTime.ToTimestamp(dateTime);

        }
        public static DateTime ToDateTime(this int timestamp)
        {
            return UnixTime.ToDateTime(timestamp);

        }




        public static T MakeSync<T>(this Task<T> task) {
            return task.GetAwaiter().GetResult();
        }

        public static void MakeSync(this Task task) {
            task.GetAwaiter().GetResult();
        }
 
    }
}