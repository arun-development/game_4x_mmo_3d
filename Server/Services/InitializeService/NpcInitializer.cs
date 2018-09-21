using System;
using System.Data;
using System.Linq;
using Server.Core.Infrastructure;
using Server.Core.Interfaces;
using Server.Core.Interfaces.UserServices;
using Server.Core.СompexPrimitive;
using Server.DataLayer;
using Server.Extensions;
using Server.Services.NpcArea;
using Server.Services.UserService;

namespace Server.Services.InitializeService
{
    public class NpcInitializer : INpcInitializer
    {
        #region Declare

        //public const int NpcMaxId =2;
        private readonly IAllianceService _allianceService;

        private readonly ChannelService _channelService;
        private readonly IGameUserService _gameUserService;
        private readonly IMothershipService _mothershipService;
        private readonly IDbProvider _dbProvider;


        public NpcInitializer(IAllianceService allianceService,
            IGameUserService gameUserService,
            IMothershipService mothershipService, IChannelService channelService, IDbProvider dbProvider)
        {
            _allianceService = allianceService;
            _gameUserService = gameUserService;
            _mothershipService = mothershipService;
            _dbProvider = dbProvider;
            _channelService = (ChannelService)channelService;
        }

        #endregion

        #region Interface

        public void CreateMotherNpces(IDbConnection connection)
        {
            var npces = NpcHelper.GetAllNpc();

            foreach (var npc in npces.Select(i => i.Value.NpcMother))
            {
                CreateMotherNpc(connection, npc);
            }
        }

        public void CreateMotherNpc(IDbConnection connection, UserMothershipDataModel npc)
        {
            try
            {
                _mothershipService.AddOrUpdate(connection, npc);
            }
            //catch (DuplicateKeyException e)
            catch (Exception e)
            {
                var q = e;
                throw;
            }
        }

        public void DeleteNpcMothers(IDbConnection connection)
        {
            _mothershipService.DeleteNpcMothers(connection);
        }

        public void Init(IDbConnection connection)
        {
            var npces = NpcHelper.GetAllNpc();
            foreach (var npc in npces)
            {
                CreateNpc(connection, npc.Value);
            }
        }

        #endregion

        public string Test(string message = "Ok") => message;


        /// <summary>
        ///     todo  вставляется тригером базы данных
        /// </summary>
        private void CreateCreatorAllianceUser()
        {
        }

        private void CreateNpc(IDbConnection connection, NpcModel npc)
        {


            // _dbProvider.Exec(connection, sqlResetIdentity);
            var npcKey = npc.NpcUser.Id;
           // npc.NpcUser.Id = 0;
            var insertedUser = _gameUserService.AddOrUpdate(connection, npc.NpcUser);
            if (insertedUser.Id != npcKey && npcKey!=0)
            {
                throw new NotImplementedException("insertedUser.Id!= npcKey");
            }
            npc.NpcUser.Id = insertedUser.Id;

    
            var npcAlliance = _allianceService.AddOrUpdate(connection, npc.NpcAlliance);

            if (npcAlliance.Id != npcKey )
            {
                throw new NotImplementedException("npcAlliance.Id != npcKey");
            }
            npc.NpcAlliance.Id = npcKey;

            var npcAllianceUser = _allianceService.GetAllianceUserById(connection,npcKey);
            if (npcAllianceUser == null)
            {
                throw new NotImplementedException("creator alliance user incorrect");
            }
            
            var password = Guid.NewGuid().ToString();
            var npcChannel = _channelService.CreateAllianceChannel(connection, npcAlliance, password);
            if (npc.NpcUser.Id == Npc.ConfederationGameUserId)
            {
                _channelService.CreateMessage(connection, new ChannelMessageDataModel
                {
                    UserId = npc.NpcUser.Id,
                    DateCreate = UnixTime.UtcNow(),
                    ChannelId = npcChannel.Id,
                    UserName = npc.NpcUser.Nickname,
                    Message = "Welcome to Confederation!",
                    UserIcon = npc.NpcUser.Avatar.Icon
                });
            }
        }
    }
}