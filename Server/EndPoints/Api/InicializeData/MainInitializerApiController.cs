using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Server.Core.Interfaces;
using Server.Core.Interfaces.Confederation;
using Server.DataLayer;
using Server.EndPoints.Hubs.GameHub;
using Server.Infrastructure;
using Server.Services;

namespace Server.EndPoints.Api.InicializeData
{
    [Route("api/MainInitializer/[action]")]
    public class MainInitializerApiController : InitApiController
    {
        private readonly IAuthUsersInitializer _authUsersInitializer;
        private readonly IMainInitializer _mainInitializer;
        private readonly INpcTaskRunner _npcTaskRunner;
        private readonly IHubContext<MainGameHub> _hub;
        private readonly IGameRunner _gameRunner;


        public MainInitializerApiController(IServiceProvider serviceProvider) : base(serviceProvider, false)
        {
            //Request.UserHostAddress
            _mainInitializer = serviceProvider.GetService<IMainInitializer>();
            _authUsersInitializer = serviceProvider.GetService<IAuthUsersInitializer>();
            _npcTaskRunner = serviceProvider.GetService<INpcTaskRunner>();
            _hub = serviceProvider.GetService<IHubContext<MainGameHub>>();
            _gameRunner = serviceProvider.GetService<IGameRunner>();
        }



        [HttpPost]

        public IActionResult DeleteAll()
        {
            _checkDataBase();
            var data = _dbProvider.ContextAction(connection =>
            {
                connection.OpenIfClosed();
                try
                {
                    _mainInitializer.DeleteAll(connection);
                    _startOrStop(connection, false);
                    return _createAppvarsReader(connection);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }

                finally
                {
                    connection.CloseIfOpened();
                }


            });
            return Json(data);
        }


        [HttpPost]
 
        public async Task<IActionResult> CreateAll()
        {
            _checkDataBase();
          return  await Task.Factory.StartNew(() =>
            {
                var data = _dbProvider.ContextAction(connection =>
                {
                    connection.OpenIfClosed();
                    try
                    {
                        if (!_gameRunner.CahceInitialized)
                        {
                            _gameRunner.InitCaches(connection);
                        }
                        _mainInitializer.CreateAll(connection);
                        _onAppStart(connection);
                        return _createAppvarsReader(connection);
                        //Server.Services.GameRunner.InitCaches
                    }
                    catch (Exception e)
                    {
 
                        Console.WriteLine(e);
                        throw;
                    }
                    finally
                    {
                        connection.CloseIfOpened();
                    }


                });

                return Json(data);
            });
        

        }


        [HttpPost]
        //   [ApiAntiForgeryValidate]
        public IActionResult CreateMainRoles()
        {
            _checkDataBase();

            _dbProvider.ContextAction(connection =>
            {
                using (var um = _authUsersInitializer.DbInitializer.UserManager)
                {
                    using (var rm = _authUsersInitializer.DbInitializer.RoleManager)
                    {
                        _authUsersInitializer.CreateMainRoles(connection, um, rm);
                    }
                }

                return true;
            });
            return Json("Ok");
        }


        [HttpPost]
        // [ApiAntiForgeryValidate]
        public IActionResult CreateFakeAuthUsers()
        {
            _checkDataBase();
            _dbProvider.ContextAction(connection =>
            {
                using (var um = _authUsersInitializer.DbInitializer.UserManager)
                {
                    _authUsersInitializer.GenerateFakeAuthUsers(connection, um);

                }

                return true;
            });

            return Json("Ok");

        }


        [HttpPost]
        //  [ApiAntiForgeryValidate]
        public IActionResult DeleteFakeUsers()
        {
            _checkDataBase();
            _dbProvider.ContextAction(connection =>
            {
                using (var um = _authUsersInitializer.DbInitializer.UserManager)
                {
                    _authUsersInitializer.DeleteFakeUsers(connection, um);

                }

                return true;
            });

            return Json("Ok");
        }

        [HttpPost]
        // [ApiAntiForgeryValidate]
        public IActionResult AddUserToRole(string userId, string roleName)
        {
            _checkDataBase();
            _dbProvider.ContextAction(connection =>
                {
                    _authUsersInitializer.TestAddUserToRole(connection, userId, roleName);
                    return true;
                });


            //UpdateSessionUser = true;
            return Json("Ok");
        }


        [HttpPost]
        // [ApiAntiForgeryValidate]
        public IActionResult Start()
        {
            _dbProvider.ContextAction(connection =>
             {
                 try
                 {
                     connection.OpenIfClosed();
                     _startOrStop(connection, true);
                     return true;
                 }
                 catch (Exception e)
                 {
                     Console.WriteLine(e);
                     throw;
                 }
                 finally
                 {
                     connection.CloseIfOpened();
                 }

             });
            _startDemons();
            var data = _dbProvider.ContextAction(_createAppvarsReader);
            return Json(data);
        }

        [HttpPost]
        //   [ApiAntiForgeryValidate]
        public IActionResult Stop()
        {
            var data = _dbProvider.ContextAction(connection =>
            {
                connection.OpenIfClosed();
                try
                {
                    _startOrStop(connection, false);
                    return _createAppvarsReader(connection);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
                finally
                {
                    connection.CloseIfOpened();
                }

            });

            return Json(data);
        }


        [HttpPost]
        //   [ApiAntiForgeryValidate]
        public IActionResult StartDemons()
        {
            var data = _dbProvider.ContextAction(connection =>
            {
                connection.OpenIfClosed();
                try
                {
                    _onAppStart(connection);
                    return _createAppvarsReader(connection);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
                finally
                {
                    connection.CloseIfOpened();
                }

            });
            _startDemons();
            return Json(data);
        }

        [HttpPost]
        // [ApiAntiForgeryValidate]
        public IActionResult StopDemons()
        {
            _stopDemons();
            var data = _dbProvider.ContextAction(_createAppvarsReader);
            return Json(data);
        }

        [HttpPost]
        public IActionResult RefreshAppData()
        {

            var data = _dbProvider.ContextAction(_createAppvarsReader);
            return Json(data);
        }

        private Dictionary<string, object> _createAppvarsReader(IDbConnection connetion)
        {
            var reader = _svp.GetService<IAppVarsReader>();
            return reader.Create(connetion);
        }


        private bool _startOrStop(IDbConnection connection, bool startOrStop)
        {
            var result = false;
            if (startOrStop)
            {

                connection.OpenIfClosed();
                result = _gameRunner.InitCaches(connection);
                _onAppStart(connection);
                connection.CloseIfOpened();

            }
            else
            {
                _stopDemons();
                result = _gameRunner.ClearCaches();
            }
            return result;
        }


        private void _onAppStart(IDbConnection connetion)
        {
            _svp.GetService<IConfederationService>().OnAppStart(connetion);
        }

        private void _startDemons()
        {

            if (_npcTaskRunner.Stoped)
            {
                _npcTaskRunner.Run();
            }

            _svp.GetService<ISynchronizer>().StartDemons();
        }

        private void _stopDemons()
        {

 
            _hub.Clients.All.InvokeAsync("disconnect", true);

            _svp.GetService<IConfederationService>().OnAppStop();
            _svp.GetService<ISynchronizer>().StopDemons();

            if (_npcTaskRunner.Stoped)
            {
                return;
            }
            _npcTaskRunner.Stop();
        }
    }
}