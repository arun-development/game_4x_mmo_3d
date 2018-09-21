using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Server.DataLayer;
using Server.Modules.Localize;

namespace Server.Core.Infrastructure.Alliance
{
    public enum AllianceRoles : byte
    {
        Creator = 1,
        Recrut = 2,
        Director = 3,

        RecrutManager =4,
        Scientist = 5,
        InfoManager = 6,
        AdvManager = 7,
        ChannelManager = 8,
        
        Reader = 11,
        Outcast=12



    }
    public enum OldNewAllianceKeys : byte
    {
        OldAlliacne = 1,
        NewAlliacne = 2,
        OldAllianceUser = 3,
        NewAllianceUser = 4,

        OldAllianceUsers = 5,
        NewAllianceUsers = 6,

        OldChannel = 7,
        NewChannel = 8,

        OldChannelConnection = 9,
        NewChannelConnection = 10,

        OldChannelConnections = 11,
        NewChannelConnections = 12,

        OldBalanceCc = 13,
        NewBalanceCc = 14,

        OldTech = 15,
        NewTech = 16,

    }

    public static class AllianceRoleHelper
    {


        public enum RoleField : byte
        {
            EditAllianceInfo = 3,
            MessageRead = 4,
            MessageSend = 5,
            ShowManage = 6,
            SetTech = 7,
            CanManagePermition = 8,
            AcceptNewMembers = 9,
            DeleteMembers = 10
        }

        #region RoleNameTranslate
        // данные формируются на клиенте здесь в них нет необходимости
        public static readonly L10NSimple Leader = new L10NSimple
        {
            En = "Leader",
            Es = "Líder",
            Ru = "Лидер"
        };

        public static readonly L10NSimple Recrut = new L10NSimple
        {
            En = "Member",
            Es = "Miembro",
            Ru = "Участник"
        };
        public static readonly L10NSimple Director = new L10NSimple
        {
            En = "Director",
            Es = "Director",
            Ru = "Директор"
        };


        //==
        public static readonly L10NSimple RecrutManager = new L10NSimple
        {
            En = "HR Manager",
            Es = "HR Gerente",
            Ru = "HR Менеджер"
        };
        public static readonly L10NSimple ScientistManager = new L10NSimple
        {
            En = "Scientist",
            Es = "Científico",
            Ru = "Учёный"
        };

        public static readonly L10NSimple InfoManager = new L10NSimple
        {
            En = "Community manager",
            Es = "El responsable de comunicacion",
            Ru = "Комьюнити менеджер"
        };
        public static readonly L10NSimple AdvManager = new L10NSimple
        {
            En = "Deputy director",
            Es = "Subdirector",
            Ru = "Заместитель директора"
        };
        public static readonly L10NSimple ChannelManager = new L10NSimple
        {
            En = "Messenger",
            Es = "Mensajero",
            Ru = "Связист"
        };
        public static readonly L10NSimple Reader = new L10NSimple
        {
            En = "Observer",
            Es = "Observador",
            Ru = "Наблюдатель"
        };
        public static readonly L10NSimple Outcast = new L10NSimple
        {
            En = "Outcast",
            Es = "El exiliado",
            Ru = "Изгой"
        };

        public static readonly ConcurrentDictionary<string, L10NSimple> RoleNames = new ConcurrentDictionary<string, L10NSimple>(new Dictionary<string, L10NSimple>
            {
                //main roles
                {AllianceRoles.Creator.ToString(), Leader},
                {AllianceRoles.Recrut.ToString(), Recrut},
                {AllianceRoles.Director.ToString(), Director},

                //main managers
                {AllianceRoles.RecrutManager.ToString(), RecrutManager},
                {AllianceRoles.Scientist.ToString(), ScientistManager},
                {AllianceRoles.InfoManager.ToString(), InfoManager},
                {AllianceRoles.AdvManager.ToString(), AdvManager},
                {AllianceRoles.ChannelManager.ToString(), ChannelManager},
                //adv user rolers
                {AllianceRoles.Reader.ToString(), Reader},
                {AllianceRoles.Outcast.ToString(), Outcast},
            });

        #endregion

        #region FieldName
        public static readonly L10NSimple EditAllianceInfo = new L10NSimple
        {
            En = "EN EditAllianceInfo",
            Es = "ES EditAllianceInfo",
            Ru = "RU EditAllianceInfo"
        };

        public static readonly L10NSimple MessageRead = new L10NSimple
        {
            En = "EN MessageRead",
            Es = "ES MessageRead",
            Ru = "RU MessageRead"
        };

        public static readonly L10NSimple MessageSend = new L10NSimple
        {
            En = "EN MessageSend",
            Es = "ES MessageSend",
            Ru = "RU MessageSend"
        };

        public static readonly L10NSimple ShowManage = new L10NSimple
        {
            En = "EN ShowManage",
            Es = "ES ShowManage",
            Ru = "RU ShowManage"
        };

        public static readonly L10NSimple SetTech = new L10NSimple
        {
            En = "EN SetTech",
            Es = "ES SetTech",
            Ru = "RU SetTech"
        };

        public static readonly L10NSimple CanManagePermition = new L10NSimple
        {
            En = "EN CanManagePermition",
            Es = "ES CanManagePermition",
            Ru = "RU CanManagePermition"
        };

        public static readonly L10NSimple AcceptNewMembers = new L10NSimple
        {
            En = "EN AcceptNewMembers",
            Es = "ES AcceptNewMembers",
            Ru = "RU AcceptNewMembers"
        };

        public static readonly L10NSimple DeleteMembers = new L10NSimple
        {
            En = "EN DeleteMembers",
            Es = "ES DeleteMembers",
            Ru = "RU DeleteMembers"
        };

        public static readonly ConcurrentDictionary<string, L10NSimple> RoleFields = new ConcurrentDictionary<string, L10NSimple>(new Dictionary<string, L10NSimple>{
                {RoleField.EditAllianceInfo.ToString(), EditAllianceInfo},
                {RoleField.MessageRead.ToString(), MessageRead},
                {RoleField.MessageSend.ToString(), MessageSend},
                {RoleField.ShowManage.ToString(), ShowManage},
                {RoleField.SetTech.ToString(), SetTech},
                {RoleField.CanManagePermition.ToString(), CanManagePermition},
                {RoleField.AcceptNewMembers.ToString(), AcceptNewMembers},
                {RoleField.DeleteMembers.ToString(), DeleteMembers}
            });

        #endregion



        /// <summary>
        /// </summary>
        /// <param name="key"></param>
        /// <param name="roleOrField"> if true - RoleName, false RoleField</param>
        /// <returns></returns>
        public static L10NSimple GetTranslateKey(string key, bool roleOrField)
        {
            L10NSimple result;
            if (roleOrField)
            {
                RoleNames.TryGetValue(key, out result);
                return result;
            }
            RoleFields.TryGetValue(key, out result);
            return result;
        }


        public static AllianceRoleDataModel GetByRoleId(byte roleId)
        {
            AllianceRoleDataModel result;
            Roles.TryGetValue(roleId, out result);
            return result;
        }

        public static AllianceRoleDataModel GetByRoleName(string roleName)
        {
            var role = Roles.FirstOrDefault(i => i.Value.RoleName == roleName);
            if (role.Value == null) throw new NotImplementedException("Role not exist");
            return role.Value;
        }





        #region RoleVals
        //main roles
        public static AllianceRoleDataModel LeaderRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.Creator,
            EditAllianceInfo = true,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.Creator.ToString(),
            SetTech = true,
            ShowManage = true,
            CanManagePermition = true,
            AcceptNewMembers = true,
            DeleteMembers = true
        };

        public static AllianceRoleDataModel RecrutRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.Recrut,
            EditAllianceInfo = false,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.Recrut.ToString(),

            SetTech = false,
            ShowManage = false,
            CanManagePermition = false,
            AcceptNewMembers = false,
            DeleteMembers = false
        };

        public static AllianceRoleDataModel DirectorRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.Director,
            EditAllianceInfo = true,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.Director.ToString(),

            SetTech = true,
            ShowManage = true,
            CanManagePermition = true,
            AcceptNewMembers = true,
            DeleteMembers = true
        };


        //managers
        public static AllianceRoleDataModel RecrutManagerRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.RecrutManager,
            EditAllianceInfo = false,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.RecrutManager.ToString(),

            SetTech = false,
            ShowManage = true,
            CanManagePermition = false,
            AcceptNewMembers = true,
            DeleteMembers = false
        };
        public static AllianceRoleDataModel ScientistManagerRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.Scientist,
            EditAllianceInfo = false,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.Scientist.ToString(),

            SetTech = true,
            ShowManage = true,
            CanManagePermition = false,
            AcceptNewMembers = false,
            DeleteMembers = false
        };
        public static AllianceRoleDataModel InfoManagerRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.InfoManager,
            EditAllianceInfo = true,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.InfoManager.ToString(),

            SetTech = false,
            ShowManage = true,
            CanManagePermition = false,
            AcceptNewMembers = false,
            DeleteMembers = false
        };
        public static AllianceRoleDataModel AdvancedManagerRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.AdvManager,
            EditAllianceInfo = true,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.AdvManager.ToString(),

            SetTech = true,
            ShowManage = true,
            CanManagePermition = false,
            AcceptNewMembers = true,
            DeleteMembers = false
        };
        public static AllianceRoleDataModel ChannelManagerRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.ChannelManager,
            EditAllianceInfo = false,
            MessageRead = true,
            MessageSend = true,
            RoleName = AllianceRoles.ChannelManager.ToString(),

            SetTech = false,
            ShowManage = true,
            CanManagePermition = false,
            AcceptNewMembers = false,
            DeleteMembers = false
        };

        //adv user rolers
        public static AllianceRoleDataModel ReaderRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.Reader,
            EditAllianceInfo = false,
            MessageRead = true,
            MessageSend = false,
            RoleName = AllianceRoles.Reader.ToString(),

            SetTech = false,
            ShowManage = false,
            CanManagePermition = false,
            AcceptNewMembers = false,
            DeleteMembers = false
        };
        public static AllianceRoleDataModel OutcastRole = new AllianceRoleDataModel
        {
            Id = (byte)AllianceRoles.Outcast,
            EditAllianceInfo = false,
            MessageRead = false,
            MessageSend = false,
            RoleName = AllianceRoles.Outcast.ToString(),

            SetTech = false,
            ShowManage = false,
            CanManagePermition = false,
            AcceptNewMembers = false,
            DeleteMembers = false
        };

        

        public static readonly ConcurrentDictionary<byte, AllianceRoleDataModel> Roles = new ConcurrentDictionary<byte, AllianceRoleDataModel>(new Dictionary<byte, AllianceRoleDataModel>
            {
                {LeaderRole.Id, LeaderRole},
                {RecrutRole.Id, RecrutRole},
                {DirectorRole.Id, DirectorRole},
                {RecrutManagerRole.Id, RecrutManagerRole},
                {ScientistManagerRole.Id, ScientistManagerRole},
                {InfoManagerRole.Id, InfoManagerRole},
                {AdvancedManagerRole.Id, AdvancedManagerRole},
                {ChannelManagerRole.Id, ChannelManagerRole},
                {ReaderRole.Id, ReaderRole},
                {OutcastRole.Id, OutcastRole}

            });

        #endregion
    }

    public static class AllianceHelper
    {
        public const int CreatePrice = 100;
    }
}