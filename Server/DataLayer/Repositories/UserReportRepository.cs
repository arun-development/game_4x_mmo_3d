using System;
using System.Collections.Generic;
using System.Data;
using Server.Core.Battle;
using Server.Core.StaticData;
using Server.Core.СompexPrimitive.Resources;
using Server.Extensions;

namespace Server.DataLayer.Repositories
{
    public interface IUserReportRepository : IAdapterDapper<user_report, UserReportDataModel, int>,
        IDeleteAllProcedure
    {
    }

    public class UserReportRepository :
        AdapterDapperRepository<user_report, UserReportDataModel, int>,
        IUserReportRepository
    {
        public UserReportRepository(IDbProvider dataProvider) : base(dataProvider)
        {
        }

        public override bool DeleteAllProcedure(IDbConnection connection)
        {
            return _deleteAllProcedire(connection, "user_report_delete_all", false, "user_report",1);
        }

  

        public override UserReportDataModel ConvertToWorkModel(user_report entity)
        {
            return _convertFromProcedure(entity);
        }


        protected override void _setUpdatedData(user_report oldData, UserReportDataModel newData)
        {
            if (newData.Resources == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.Resources));
            if (newData.RoundsLog == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.RoundsLog));

            if (newData.AtackerSummaryReport == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.AtackerSummaryReport));
            if (newData.DefenderSummaryReport == null)
                throw new ArgumentNullException(Error.IsEmpty, nameof(newData.DefenderSummaryReport));
            if (newData.AtackerResultStatus == default(BattleResult))
                throw new ArgumentException(Error.IsEmpty, nameof(newData.AtackerResultStatus));

            var resources = newData.Resources.ToSerealizeString();
            var roundsLog = newData.RoundsLog.ToSerealizeString();


            var atackerSummaryReport = newData.AtackerSummaryReport.ToSerealizeString();
            var defenderSummaryReport = newData.DefenderSummaryReport.ToSerealizeString();
            var atackerResultStatus = (byte) newData.AtackerResultStatus;


            if (oldData.Id != newData.Id)
                oldData.Id = newData.Id;
            if (oldData.taskId != newData.TaskId)
                oldData.taskId = newData.TaskId;
            if (oldData.resources != resources)
                oldData.resources = resources;
            if (oldData.battleTime != newData.BattleTime)
                oldData.battleTime = newData.BattleTime;
            if (oldData.roundsLog != roundsLog)
                oldData.roundsLog = roundsLog;
            if (oldData.defenderUserId != newData.DefenderUserId)
                oldData.defenderUserId = newData.DefenderUserId;
            if (oldData.defenderUserName != newData.DefenderUserName)
                oldData.defenderUserName = newData.DefenderUserName;

            if (oldData.atackerSummaryReport != atackerSummaryReport)
                oldData.atackerSummaryReport = atackerSummaryReport;
            if (oldData.defenderSummaryReport != defenderSummaryReport)
                oldData.defenderSummaryReport = defenderSummaryReport;
            if (oldData.atackerDeleteReport != newData.AtackerDeleteReport)
                oldData.atackerDeleteReport = newData.AtackerDeleteReport;
            if (oldData.defenderDeleteReport != newData.DefenderDeleteReport)
                oldData.defenderDeleteReport = newData.DefenderDeleteReport;
            if (oldData.atackerUserId != newData.AtackerUserId)
                oldData.atackerUserId = newData.AtackerUserId;
            if (oldData.atackerWin != newData.AtackerWin)
                oldData.atackerWin = newData.AtackerWin;
            if (oldData.atackerIsSkagry != newData.AtackerIsSkagry)
                oldData.atackerIsSkagry = newData.AtackerIsSkagry;
            if (oldData.atackerUserName != newData.AtackerUserName)
                oldData.atackerUserName = newData.AtackerUserName;
            if (oldData.atackerResultStatus != atackerResultStatus)
                oldData.atackerResultStatus = atackerResultStatus;
        }


        private static UserReportDataModel _convertFromProcedure(IUReportDbItem data)
        {
            var result = new UserReportDataModel();
            if (data == null)
                return result;
            result.Id = data.Id;
            result.TaskId = data.taskId;
            result.Resources = data.resources.ToSpecificModel<MaterialResource>();
            result.BattleTime = data.battleTime;
            result.RoundsLog = data.roundsLog.ToSpecificModel<List<Round>>();
            result.DefenderUserId = data.defenderUserId;
            result.DefenderUserName = data.defenderUserName;

            result.AtackerSummaryReport = data.atackerSummaryReport.ToSpecificModel<BattleFleets>();
            result.DefenderSummaryReport = data.defenderSummaryReport.ToSpecificModel<BattleFleets>();

            result.AtackerDeleteReport = data.atackerDeleteReport;
            result.DefenderDeleteReport = data.defenderDeleteReport;
            result.AtackerUserId = data.atackerUserId;
            result.AtackerWin = data.atackerWin;
            result.AtackerIsSkagry = data.atackerIsSkagry;
            result.AtackerUserName = data.atackerUserName;
            result.AtackerResultStatus = (BattleResult) data.atackerResultStatus;

            return result;
        }
    }
}