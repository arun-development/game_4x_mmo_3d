using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Images;
using Server.Core.Infrastructure;
using Server.Core.Infrastructure.Alliance;
using Server.Core.Infrastructure.Unit;
using Server.Core.Npc;
using Server.Core.Tech;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Other;
using Server.Core.СompexPrimitive.Resources;
using Server.Core.СompexPrimitive.Units;
using Server.DataLayer;
using Server.Extensions;
using Server.Modules.Localize;
using Server.ServicesConnected.AzureStorageServices.ImageService;

namespace Server.Services.NpcArea
{



    public class NpcUser : UserDataModel
    {
        private L10NSimple _description;
        public override string AuthId => Nickname;

        public void Init(string npcName, int npcId, Avatar avatar = null, L10NSimple description = null,Dictionary<int, MeedDbModel> meeds = null)
        {
            Id = npcId;
            Nickname = npcName;
            AuthId = npcName;
            DateCreate = DateTime.UtcNow;
            IsNpc = true;
            Avatar=(UserImageModel) avatar ?? ServicesConnected.AzureStorageServices.ImageService.Avatar.DefaultUrls();


        }

        public void SetDescription(L10NSimple description)
        {
            if (description != null)
            {
                _description = description;
                Description = description.ToSerealizeString();
            }
        }
        public L10NSimple GetDescription()
        {
            if (_description != null) return _description;
            if (string.IsNullOrWhiteSpace(Description)) return _description = new L10NSimple();
            return _description = Description.ToSpecificModel<L10NSimple>();
        }
    }

    public class NpcMother : UserMothershipDataModel
    {
        public override Dictionary<UnitType, TurnedUnit> UnitProgress { get; set; } =
            new Dictionary<UnitType, TurnedUnit>();

        public void Init(NpcUser npc, StorageResources sr = null, Dictionary<UnitType, int> hangar = null,
            MaterialResource extraction = null)
        {
            Id = npc.Id;
            Resources = sr ?? StorageResources.InitPlanetResources();
            Hangar = hangar ?? UnitList.InitUnitsInOwn(true);
            ExtractionProportin = extraction ?? MaterialResource.InitBaseOwnProportion();
            StartSystemId = 1;
            LastUpgradeProductionTime = 0;
            LaboratoryProgress = new ItemProgress();
            var teches = new BattleTeches();
            teches.CreateStartTeches();
            TechProgress = teches.ConvertToDbTeches();
        }
    }
 
    public class NpcAlliance : AllianceDataModel
    {
        private L10NSimple _description;

        public void Init(NpcUser npc, L10NSimple description = null, Label img = null)
        {
            NpcAllianceId npcAllianceId;
            Enum.TryParse(npc.Nickname, true, out npcAllianceId);
            Id = (int)npcAllianceId;
            Name = npc.Nickname;
            CreatorId = npc.Id;
            CreatorName = npc.Nickname;
            DateCreate = npc.DateCreate;
            Description = (description == null) ? new L10NSimple().ToSerealizeString() : description.ToSerealizeString();
            Images = img ?? Label.DefaultUrls();
            Disbandet = false;
            //  UserImagesDirectory.CheckUserDirectory(Label.Type, Id);
        }

        public L10NSimple GetDescription()
        {
            if (_description != null) return _description;
            if (string.IsNullOrWhiteSpace(Description)) return _description = new L10NSimple();
            return _description = Description.ToSpecificModel<L10NSimple>();
        }

        public void SetDescription(L10NSimple description)
        {
            if (description != null)
            {
                Description = description.ToSerealizeString();
            }
        }
    }

    public class NpcAllianceUser : AllianceUserDataModel
    {
        public void Init(NpcUser npc, NpcAlliance npcAlliance,
            byte roleId = (byte) AllianceRoles.Creator)
        {
            AllianceId = npcAlliance.Id;
            UserId = npc.Id;
            RoleId = roleId;
        }
    }

    public class NpcAllianceTeth:AllianceTechDataModel
    {
    }


    public class NpcModel
    {
        public NpcModel(string npcName, int npcId)
        {
            NpcUser = new NpcUser();

            NpcUser.Init(npcName, npcId);

            NpcMother = new NpcMother();
            NpcMother.Init(NpcUser);

            NpcAlliance = new NpcAlliance();
            NpcAlliance.Init(NpcUser);

            NpcAllianceUser = new NpcAllianceUser();
            NpcAllianceUser.Init(NpcUser, NpcAlliance);

            var teches = new BattleTeches();
            teches.CreateStartTeches();
            var npcTeches = teches.ConvertToDbTeches();
            NpcAllianceTeth = new NpcAllianceTeth
            {
                Id = NpcAlliance.Id,
                Teches = npcTeches
            };
        }

        public NpcUser NpcUser { get; set; }
        public NpcMother NpcMother { get; set; }
 
        public NpcAlliance NpcAlliance { get; set; }
        public NpcAllianceUser NpcAllianceUser { get; set; }
        public NpcAllianceTeth NpcAllianceTeth { get; set; }
    }

    public static class NpcHelper
    {
        private static readonly ConcurrentDictionary<string, NpcModel> Npses =
            new ConcurrentDictionary<string, NpcModel>();

        static NpcHelper()
        {
            if (!HasName(Npc.SkagyName)) Npses.TryAdd(Npc.SkagyName, CreateSkagryNpc());
            if (!HasName(Npc.ConfederationName)) Npses.TryAdd(Npc.ConfederationName, ConfederationNpc());
            //    CreateReservedNpc(Npses);
        }


        private static NpcModel CreateSkagryNpc()
        {
            var skagry = new NpcModel(Npc.SkagyName, Npc.SkagryGameUserId);

            var userDescription = skagry.NpcUser.GetDescription();
            userDescription.Ru = "Ru Skagry user description";
            userDescription.Es = "Es Skagry user description";
            userDescription.En = "EN Skagry user description";
            skagry.NpcUser.SetDescription(userDescription);


            var allianceDescription = skagry.NpcAlliance.GetDescription();
            allianceDescription.Ru = "Ru Skagry Alliance description";
            allianceDescription.Es = "Es Skagry Alliance description";
            allianceDescription.En = "EN Skagry Alliance description";
            skagry.NpcAlliance.SetDescription(allianceDescription);

            return skagry;
        }

        private static NpcModel ConfederationNpc()
        {
            var confederation = new NpcModel(Npc.ConfederationName, Npc.ConfederationGameUserId);

            var userDescription = confederation.NpcUser.GetDescription();
            userDescription.Ru = "Ru confederation user description";
            userDescription.Es = "Es confederation user description";
            userDescription.En = "EN confederation user description";
            confederation.NpcUser.SetDescription(userDescription);

            var allianceDescription = confederation.NpcAlliance.GetDescription();
            allianceDescription.Ru = "Ru confederation Alliance description";
            allianceDescription.Es = "Es confederation Alliance description";
            allianceDescription.En = "EN confederation Alliance description";
            confederation.NpcAlliance.SetDescription(allianceDescription);

            confederation.NpcAlliance.Tax = 20;

            return confederation;
        }

        private static void CreateReservedNpc(IDictionary<string, NpcModel> npcrepository, int count = 0)
        {
            var prefix = "TestNpcName";
            var startId = npcrepository.Count;
            if (count == 0) return;
            for (var i = 1; i < count; i++)
            {
                var id = startId + i;
                var name = prefix + id;

                if (HasName(name)) continue;
                var item = new NpcModel(name, id);


                var userDescription = item.NpcUser.GetDescription();
                userDescription.Ru = "Ru " + name + " user description";
                userDescription.Es = "Es " + name + " user description";
                userDescription.En = "EN " + name + " user description";
                item.NpcUser.SetDescription(userDescription);


                var allianceDescription = item.NpcAlliance.GetDescription();
                allianceDescription.Ru = "Ru " + name + " Alliance description";
                allianceDescription.Es = "Es " + name + " Alliance description";
                allianceDescription.En = "EN " + name + " Alliance description";
                item.NpcAlliance.SetDescription(allianceDescription);
                // item.NpcAlliance.Disbandet = false;
                npcrepository.Add(name, item);
            }
        }

        public static Dictionary<string, NpcModel> GetAllNpc()
        {
            return Npses.OrderBy(i => i.Value.NpcUser.Id).ToDictionary(i => i.Key, i => i.Value);
        }

        public static void UpdateNpc(string npcNativeName, NpcModel newNpcModel)
        {
            Npses.AddOrUpdateSimple(newNpcModel.NpcUser.Nickname, newNpcModel);
        }

        public static Dictionary<string, NpcModel> UpdateAllNpses(Dictionary<string, NpcModel> newNpses)
        {
            foreach (var npc in newNpses) UpdateNpc(npc.Key, npc.Value);

            return GetAllNpc();
        }

        public static bool HasName(string npcNativeName)
        {
            return Npses.ContainsKey(npcNativeName);
        }

        public static NpcModel GetNpcByName(string npcNativeName)
        {
            if (!HasName(npcNativeName))
                throw new InvalidOperationException("npc name is wrong value: " + npcNativeName);
            NpcModel npc;
            Npses.TryGetValue(npcNativeName, out npc);
            return npc;
        }

    }
}