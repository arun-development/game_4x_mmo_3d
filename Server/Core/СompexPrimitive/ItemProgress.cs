using System;
using Server.Core.Interfaces;
using Server.Extensions;

namespace Server.Core.СompexPrimitive {
    public interface IChekableProgress {
        bool CheckProgressIsDone();
        int GetLevel(int defaultVal = 0);
    }

    public class ItemProgress : IChekableProgress, IEquatable<ItemProgress>, ICreateNew<ItemProgress> {
        public ItemProgress() { }

        protected ItemProgress(ItemProgress other) {
            SetFromOther(other);
        }

        public ItemProgress(int startLevel) {
            Level = startLevel;
            StartTime = 0;
            Duration = 0;
            IsProgress = false;
            RemainToComplete = 0;
 
        }

        public int? Level { get; set; }

        /// <summary>
        ///     utc timestamp
        /// </summary>
        public int? StartTime { get; set; }

        public int? Duration { get; set; }
        public bool? IsProgress { get; set; }
        public double? RemainToComplete { get; set; }
   
        public object Advanced { get; set; }

        public bool CheckProgressIsDone() {
            if (IsProgress == null || IsProgress == false) {
                return false;
            }
            return StartTime + Duration - UnixTime.UtcNow() <= 0;
        }

        public int GetLevel(int defaultVal = 0) {
            return Level ?? defaultVal;
        }

        public ItemProgress CreateNew(ItemProgress other) {
            return new ItemProgress(other);
        }

        public ItemProgress CreateNewFromThis() {
            return new ItemProgress(this);
        }

        public void SetFromOther(ItemProgress other) {
            Level = other.Level;
            StartTime = other.StartTime;
            Duration = other.Duration;
            IsProgress = other.IsProgress;
            RemainToComplete = other.RemainToComplete;
            if (other.Advanced != null) {
                Advanced = other.Advanced.CloneDeep();
            }
        }


        public ItemProgress SetProgress(int? level = null, int? startTime = null, int? duration = null,
            bool? isProgress = null) {
            Level = level;
            StartTime = startTime;
            Duration = duration;
            IsProgress = isProgress;
            return this;
        }

        public bool IsNullOrFalse() {
            return IsProgress == null || IsProgress == false
                   || StartTime == null
                   || Duration == null
                   || Level == null;
        }

        public static string InitBuildingProgressString() {
            return InitBuildingProgress().ToSerealizeString();
        }

        public static ItemProgress InitBuildingProgress() {
            return InitBuildingProgress(new ItemProgress());
        }

        public static ItemProgress InitBuildingProgress(ItemProgress emp) {
            emp.Level = 1;
            emp.StartTime = null;
            emp.Duration = null;
            emp.IsProgress = false;
            return emp;
        }

        #region Static

        public static ItemProgress ProgressUpdateComplite(ItemProgress data) {
            data.Duration = null;
            data.IsProgress = false;
            data.StartTime = null;
            data.Level += 1;
            return data;
        }

        public static int GetCount(string data = null) {
            var model = data?.ToSpecificModel<ItemProgress>();
            if (model?.Level != null) {
                return (int) model.Level;
            }
            return 0;
        }


        public static int GetLevelByData(string data = null) {
            var model = data?.ToSpecificModel<ItemProgress>();
            if (model?.Level != null) {
                return (int) model.Level;
            }
            return 1;
        }


        public static void ResetProgress(ref ItemProgress data) {
            data.IsProgress = false;
            data.StartTime = null;
            data.Duration = null;
            data.Level = GetDestroedLevel(data.Level);
        }


        private static int GetDestroedLevel(int? curLevel) {
            if (curLevel == null) {
                curLevel = 1;
            }
            if (curLevel == 1) {
                return 1;
            }
            var minlevel = (int) Math.Ceiling((decimal) curLevel / 2);
            var rand = new Random();

            return rand.Next(minlevel, (int) curLevel);
        }

        #endregion

        #region IEquatable

        public bool Equals(ItemProgress other) {
            if (ReferenceEquals(null, other)) {
                return false;
            }
            if (ReferenceEquals(this, other)) {
                return true;
            }
            return Level == other.Level && StartTime == other.StartTime && Duration == other.Duration &&
                   IsProgress == other.IsProgress && RemainToComplete.Equals(other.RemainToComplete);
        }

        public override bool Equals(object obj) {
            if (ReferenceEquals(null, obj)) {
                return false;
            }
            if (ReferenceEquals(this, obj)) {
                return true;
            }
            if (obj.GetType() != GetType()) {
                return false;
            }
            return Equals((ItemProgress) obj);
        }

        public override int GetHashCode() {
            unchecked {
                var hashCode = Level.GetHashCode();
                hashCode = (hashCode * 397) ^ StartTime.GetHashCode();
                hashCode = (hashCode * 397) ^ Duration.GetHashCode();
                hashCode = (hashCode * 397) ^ IsProgress.GetHashCode();
                hashCode = (hashCode * 397) ^ RemainToComplete.GetHashCode();
                return hashCode;
            }
        }

        public static bool operator ==(ItemProgress left, ItemProgress right) {
            return Equals(left, right);
        }

        public static bool operator !=(ItemProgress left, ItemProgress right) {
            return !Equals(left, right);
        }

        #endregion
    }
}