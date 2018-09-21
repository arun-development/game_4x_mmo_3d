using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace FileBuilder.sql {
    public class SqlPrBuilder {
        private const string _int = "INT";
        private const string _tinyint = "TINYINT";
        private const string _smallint = "SMALLINT";
        private const string _bigint = "BIGINT";
        private const string _ext = ".sql";

        private const string DeleteItemById = "delete_item_by_id";
        private const string DeleteAll = "delete_all";
        private const string GetAll = "get_all";
        private const string GetItemById = "get_item_by_id";
        private const string GetAllIds = "get_all_ids";
        private readonly List<string> _existingGroupFile = new List<string>();
        private readonly string _generateCaalog;
        private readonly string _scriptsCatalog;

        private List<string> baseNames = new List<string> {
            //alliance
            "alliance",
            "alliance_fleet",
            "alliance_request_message",
            "alliance_request_message_history",
            "alliance_role",
            "alliance_tech",
            "alliance_user",
            "alliance_user_history",

            //confederation
            "c_officer",
            "c_officer_candidat",
            "c_officer_candidat_histrory",
            "c_officer_histroy",
            "c_vote",
            "c_vote_history",

            //user channels
            "channel",
            "channel_connection",
            "channel_message",

            //world
            "g_detail_moon",
            "g_detail_planet",
            "g_detail_system",
            "g_galaxy",
            "g_game_type",
            "g_geometry_moon",
            "g_geometry_planet",
            "g_geometry_star",
            "g_geometry_system",
            "g_sectors",
            "g_system",
            "g_texture_type",
            "user_bookmark", //user


            //user
            "user",

            "user_mothership",
            "user_mother_jump",

            // user journal
            "user_report",
            "user_spy",
            "user_task",

            //store
            "user_balance_cc", //user
            "transacation_cc",
            "currency",
            "journal_buy", //user
            "user_premium", //user

            "product_store",
            "product_type",
            "user_chest", //user


            //others
            "sys_helper"
        };

        private Dictionary<string, SqlProcedureNames> delete_all;

        private Dictionary<string, SqlProcedureNames> delete_item_by_id;
        private Dictionary<string, SqlProcedureNames> get_all;
        private Dictionary<string, SqlProcedureNames> get_all_ids;
        private Dictionary<string, SqlProcedureNames> get_item_by_id;

        public SqlPrBuilder(string catalog) {
            _inittializeNames();
            _generateCaalog = catalog + @"generatedProcedure\";
            _scriptsCatalog = catalog;
        }


        private void SaveToFile(Dictionary<string, SqlProcedure> actions, string allFilesName) {
            var dir = _generateCaalog + actions.First().Value.Catalog + @"\";
            if (Directory.Exists(dir)) {
                Directory.Delete(dir, true);
            }
            Directory.CreateDirectory(dir);
            foreach (var i in actions) {
                var path = dir + i.Value.FileName;
                using (var file = new StreamWriter(path, false, Encoding.UTF8)) {
                    file.WriteLine(i.Value.ProcedureBody);
                }
            }
            var all = dir + allFilesName + _ext;
            using (var file = new StreamWriter(all, true, Encoding.UTF8)) {
                foreach (var i in actions) {
                    file.WriteLine(i.Value.ProcedureBody);
                }
                _existingGroupFile.Add(all);
            }
        }


        private Dictionary<string, SqlProcedureNames> _initializeCatalog(string actionName) {
            var cat = new Dictionary<string, SqlProcedureNames>();

            string type;
            foreach (var i in baseNames) {
                if (i == "product_store" || i == "product_item" || i == "g_texture_type" || i == "g_sectors") {
                    type = _smallint;
                }
                else if (i == "product_type" || i == "g_game_type" || i == "g_galaxy" || i == "alliance_role") {
                    type = _tinyint;
                }
                else if (i == "channel_message" || i == "channel_connection") {
                    type = _bigint;
                }
                else {
                    type = _int;
                }
                var item = new SqlProcedureNames(i, actionName, type);
                cat.Add(i, item);
            }
            return cat;
        }

        private void _inittializeNames() {
            delete_item_by_id = _initializeCatalog(DeleteItemById);
            delete_all = _initializeCatalog(DeleteAll);
            get_all = _initializeCatalog(GetAll);
            get_item_by_id = _initializeCatalog(GetItemById);
            get_all_ids = _initializeCatalog(GetAllIds);
        }

        private SqlProcedure _deleteItemById(SqlProcedureNames item) {
            var procedure = new SqlProcedure {
                FileName = item.FileName,
                Catalog = item.ActionName,
                ProcedureBody =
                    string.Format(
                        "IF EXISTS (SELECT * FROM sys.objects WHERE  name = '{1}') DROP PROCEDURE {0}.[{1}]  \n" +
                        "GO \n\n" +
                        "CREATE PROCEDURE {0}.[{1}](@Id {3}) AS\n" +
                        "BEGIN \n" +
                        "   DECLARE @sucsess bit = 0;\n" +
                        "   IF(@Id = 0 or @Id IS NULL)\n" +
                        "      BEGIN raiserror('The value should not be 0 or NULL', 15, 1)  SELECT @sucsess return END\n" +
                        "   ELSE IF NOT EXISTS(SELECT top(1) Id FROM {0}.[{2}] WHERE Id = @Id)\n" +
                        "      BEGIN raiserror('row not exist', 15, 1)  SELECT @sucsess return; END\n" +
                        "   ELSE \n" +
                        "      BEGIN TRANSACTION\n" +
                        "          BEGIN TRY \n" +
                        "          DELETE FROM {0}.[{2}] WHERE Id = @Id; SET @sucsess = 1;\n" +
                        "          COMMIT TRANSACTION END TRY \n" +
                        "          BEGIN CATCH SET @sucsess = 0; \n" +
                        "              ROLLBACK TRANSACTION \n" +
                        "              THROW; \n" +
                        "          END CATCH \n" +
                        "   SET sucsess =1; SELECT @sucsess \n" +
                        "END \n" +
                        "GO \n\n\n\n", item.ShemeName, item.ProcedureName, item.TableName, item.KeyType)
            };


            return procedure;
        }


        private SqlProcedure _deleteAll(SqlProcedureNames item) {
            var procedure = new SqlProcedure {
                FileName = item.FileName,
                Catalog = item.ActionName,
                ProcedureBody = string.Format(
                    "IF EXISTS (SELECT * FROM sys.objects WHERE  name = '{1}') DROP PROCEDURE {0}.[{1}] \n" +
                    "GO  \n\n" +
                    "CREATE PROCEDURE {0}.[{1}] AS\n" +
                    "BEGIN\n" +
                    "   DECLARE @sucsess bit =0;\n" +
                    "       IF NOT EXISTS (SELECT top(1) Id FROM {0}.[{2}])\n" +
                    "           BEGIN\n" +
                    "              SET @sucsess = 1;\n" +
                    "           END\n" +
                    "       ELSE\n" +
                    "           BEGIN\n" +
                    "               BEGIN TRY\n" +
                    "               DELETE FROM {0}.[{2}]\n" +
                    "               SET @sucsess = 1;\n" +
                    "               END TRY\n" +
                    "               BEGIN CATCH\n" +
                    "                   THROW; \n" +
                    "               END CATCH \n" +
                    "            END\n" +
                    "   SELECT  @sucsess\n" +
                    "END \n" +
                    "GO \n\n\n\n", item.ShemeName, item.ProcedureName, item.TableName)
            };
            return procedure;
        }

        private SqlProcedure _getAll(SqlProcedureNames item) {
            var procedure = new SqlProcedure {
                FileName = item.FileName,
                Catalog = item.ActionName,
                ProcedureBody = string.Format(
                    "IF EXISTS (SELECT * FROM sys.objects WHERE  name = '{1}') DROP PROCEDURE {0}.[{1}] \n" +
                    "GO  \n\n" +
                    "CREATE PROCEDURE {0}.[{1}] AS\n" +
                    "BEGIN\n" +
                    "   SELECT * FROM {0}.[{2}]" +
                    "END \n" +
                    "GO \n\n\n\n", item.ShemeName, item.ProcedureName, item.TableName)
            };
            return procedure;
        }

        private SqlProcedure _getItemById(SqlProcedureNames item) {
            var procedure = new SqlProcedure {
                FileName = item.FileName,
                Catalog = item.ActionName,
                ProcedureBody = string.Format(
                    "IF EXISTS (SELECT * FROM sys.objects WHERE  name = '{1}') DROP PROCEDURE {0}.[{1}] \n" +
                    "GO  \n\n" +
                    "CREATE PROCEDURE {0}.[{1}](@Id {3}) AS\n" +
                    "BEGIN\n" +
                    "   SELECT TOP 1 * FROM {0}.[{2}] WHERE Id =@Id\n" +
                    "END \n" +
                    "GO \n\n\n\n", item.ShemeName, item.ProcedureName, item.TableName, item.KeyType)
            };
            return procedure;
        }

        private SqlProcedure _getAllIds(SqlProcedureNames item) {
            var procedure = new SqlProcedure {
                FileName = item.FileName,
                Catalog = item.ActionName,
                ProcedureBody = string.Format(
                    "IF EXISTS (SELECT * FROM sys.objects WHERE  name = '{1}') DROP PROCEDURE {0}.[{1}] \n" +
                    "GO  \n\n" +
                    "CREATE PROCEDURE {0}.[{1}] AS\n" +
                    "BEGIN\n" +
                    "   SELECT Id FROM {0}.[{2}]\n" +
                    "END \n" +
                    "GO \n\n\n\n", item.ShemeName, item.ProcedureName, item.TableName)
            };
            return procedure;
        }

        public void InitDeleteItemById() {
            var items = delete_item_by_id.ToDictionary(i => i.Key, i => _deleteItemById(i.Value));
            SaveToFile(items, "_" + DeleteItemById);
        }

        public void InitDeleteAll() {
            var items = delete_all.ToDictionary(i => i.Key, i => _deleteAll(i.Value));
            SaveToFile(items, "_" + DeleteAll);
        }

        public void InitGetAll() {
            var items = get_all.ToDictionary(i => i.Key, i => _getAll(i.Value));
            SaveToFile(items, "_" + GetAll);
        }

        public void InitGetItemById() {
            var items = get_item_by_id.ToDictionary(i => i.Key, i => _getItemById(i.Value));
            SaveToFile(items, "_" + GetItemById);
        }

        public void InitGetAllIds() {
            var items = get_all_ids.ToDictionary(i => i.Key, i => _getAllIds(i.Value));
            SaveToFile(items, "_" + GetAllIds);
        }


        private void _addUniqueProcedures(ICollection<string> beforeRows) {
            //var procedures = new List<string>
            //{
            //    "disband_alliance",
            //    "get_alliance_count",
            //    "get_next_game_alliance_id",
            //    "get_next_game_user_id",
            //    "has_alliance_request_message_item",
            //    "leave_user_from_alliance",
            //    "reset_index",
            //    "system_unique_position",
            //    "update_alliance_icon_in_alliance_request_message"
            //};
            //var filePathes = procedures.Select(i => _scriptsCatalog + @"\procedure" + i + _ext).ToList();

            List<string> files = new List<string>();
            var funcDir = _scriptsCatalog + @"\functions\";
  

            var procedures = _scriptsCatalog + @"\procedure\";
            files.AddRange(Directory.GetFiles(funcDir));
            files.AddRange(Directory.GetFiles(procedures));

            foreach (var srcPath in files) {
                using (var reader = new StreamReader(srcPath, Encoding.UTF8)) {
                    string line;
                    while ((line = reader.ReadLine()) != null) {
                        beforeRows.Add(line);
                    }
                    reader.Close();
                }
            }
        }

        public void ConcatAllProcedures() {
            var list = new List<string>();
            _addUniqueProcedures(list);

            foreach (var i in _existingGroupFile) {
                var srcPath = i;
                using (var reader = new StreamReader(srcPath, Encoding.UTF8)) {
                    string line;
                    while ((line = reader.ReadLine()) != null) {
                        list.Add(line);
                    }
                    reader.Close();
                }
            }


            var fileResultPath = _generateCaalog + "_all_procedures" + _ext;
            if (File.Exists(fileResultPath)) {
                File.Delete(fileResultPath);
            }
            using (var file = new StreamWriter(fileResultPath, true, Encoding.UTF8)) {
                foreach (var row in list) {
                    file.WriteLine(row);
                }
            }
        }

        public void InitAll() {
           // InitDeleteItemById();
            InitDeleteAll();
            //InitGetAll();
            //InitGetItemById();
            //InitGetAllIds();
            ConcatAllProcedures();
        }


        internal class SqlProcedureNames {
            public SqlProcedureNames(string tableName, string actionName, string typeName, string shemeName = null) {
                TableName = tableName;
                ActionName = actionName;
                KeyType = typeName;
                if (shemeName != null) {
                    ShemeName = shemeName;
                }

                ProcedureName = TableName + "_" + ActionName;
                FileName = ProcedureName + _ext;
            }

            public string ShemeName { get; set; } = "[dbo]";
            public string TableName { get; set; }
            public string ActionName { get; set; }
            public string FileName { get; set; }
            public string ProcedureName { get; set; }
            public string KeyType { get; set; }
        }

        internal class SqlProcedure {
            public string FileName { get; set; }
            public string ProcedureBody { get; set; }
            public string Catalog { get; set; }
        }
    }
}