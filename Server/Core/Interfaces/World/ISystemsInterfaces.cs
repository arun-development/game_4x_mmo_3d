using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Map;
using Server.Core.Map.Structure;
using Server.DataLayer;

namespace Server.Core.Interfaces.World
{
    public interface IDetailSystemService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
        #region Sync

        TResult GetDetailSystemBySystemId<TResult>(IDbConnection connection, TPrimaryKeyType systemId, Func<TDataModel, TResult> selector);

        IList<TResult> GetAllDetailSystems<TResult>(IDbConnection connection, Func<TDataModel, TResult> selector);
        IList<GDetailSystemDataModel> GetAllDetailSystems(IDbConnection connection);
        TDataModel GetDetailSystemBySystemId(IDbConnection connection, TPrimaryKeyType systemId);


        TDataModel AddOrUpdateDetailSystem(IDbConnection connection, TDataModel dataModel);
        IList<TDataModel> AddOrUpdateDetailSystems(IDbConnection connection, IList<TDataModel> dataModel);
        void DeleteDetailSystem(IDbConnection connection, TPrimaryKeyType id);
        void DeleteAllDetailSystem(IDbConnection connection);

        #endregion
    }

    public interface IGeometryStarService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
        #region Sync

        TResult GetGeometryStarById<TResult>(IDbConnection connection, TPrimaryKeyType systemId, Func<TDataModel, TResult> selector);
        IList<TResult> GetAllGeometryStars<TResult>(IDbConnection connection, Func<TDataModel, TResult> selector);

        TDataModel AddOrUpdateGeometryStar(IDbConnection connection, TDataModel dataModel);
        IList<TDataModel> AddOrUpdateGeometryStars(IDbConnection connection, IList<TDataModel> dataModel);
        void DeleteGeometryStar(IDbConnection connection, TPrimaryKeyType id);
        void DeleteAllGeometryStar(IDbConnection connection);

        #endregion
    }

    public interface ISystemService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct where TDataModel : class
    {
        #region Sync

        TResult GetSystem<TResult>(IDbConnection connection, TPrimaryKeyType systemId, Func<TDataModel, TResult> selector);
        TDataModel AddOrUpdateSystem(IDbConnection connection, TDataModel dataModel);
        IList<TDataModel> AddOrUpdateSystems(IDbConnection connection, IList<TDataModel> dataModel);
        void DeleteSystem(IDbConnection connection, TPrimaryKeyType id);
        void DeleteAllSystems(IDbConnection connection);

        #endregion
    }

    public interface IGeometrySystemService<TPrimaryKeyType, TDataModel> where TPrimaryKeyType : struct
        where TDataModel : class
    {
        #region Sync

        TDataModel GetGeometrySystem(IDbConnection connection, TPrimaryKeyType systemId);

        /// <summary>
        ///     Возвращает планетоиды запрашиваемой системы
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="systemId"></param>
        /// <returns></returns>
        Planetoids GetSystemGeometryViewData(IDbConnection connection, TPrimaryKeyType systemId);

        IList<GGeometrySystemDataModel> GetGeometrySystems(IDbConnection connection);
        TDataModel AddOrUpdateGeometrySystem(IDbConnection connection, TDataModel systems);
        IList<TDataModel> AddOrUpdateGeometrySystems(IDbConnection connection, IList<TDataModel> systems);
        void DeleteGeometrySystem(IDbConnection connection, TPrimaryKeyType id);
        void DeleteAllGeometrySystem(IDbConnection connection);

        #endregion
    }

    public interface ISystemService : IDetailSystemService<int, GDetailSystemDataModel>,
        ISystemService<int, GSystemDataModel>, IGeometryStarService<int, GGeometryStarDataModel>,
        IGeometrySystemService<int, GGeometrySystemDataModel>, IMapAdress
    {
        #region Sync

        IList<SystemsView> GetSystemViewsBySector(IDbConnection connection, int sectorId);
        IList<int> GetSystemIds(IDbConnection connection, int sectorId);
        IList<int> GetAllSystemIds(IDbConnection connection);

        #endregion
    }
}