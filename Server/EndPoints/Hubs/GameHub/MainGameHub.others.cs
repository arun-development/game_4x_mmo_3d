using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Core.Infrastructure;
using Server.Core.StaticData;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        public async Task<IList<NameIdInt>> SercherGetUserNames(string partUserName)
        {
            _tryCatch(() =>
            {
                if (string.IsNullOrWhiteSpace(partUserName))
                    throw new ArgumentNullException(nameof(partUserName), Error.InputDataIncorrect);
            });
            
            return await _contextAction(connection => _gameUserService.FilterUserName(connection, partUserName));
        }

        public void TestApiCall(string message = "test")
        {

            Clients.Client(Context.ConnectionId).InvokeAsync("testApiCall", message);
        }
    }
}