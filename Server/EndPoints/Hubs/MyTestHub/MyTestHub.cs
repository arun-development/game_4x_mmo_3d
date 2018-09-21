using System;
using System.Threading.Tasks;
using Server.Core;
using Server.EndPoints.Hubs.GameHub;

namespace Server.EndPoints.Hubs.MyTestHub
{
    //[HubName("MyTestHub")]
    public class MyTestHub : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IServiceProvider _svp;
        private readonly ITestSrvice _myTestSrvice;
        public MyTestHub(IServiceProvider svp)
        {
            _svp = svp;
            _myTestSrvice = (ITestSrvice) _svp.GetService(typeof(ITestSrvice));
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "All");
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "All");
            await base.OnDisconnectedAsync(exception);
        }
        public async Task SendMessage(string user, string message)
        {
 
            await Clients.All.SendCoreAsync("ReceiveMessage",  new object[2]{ user, message});
        }

        public Task<string> Test(int index)
        {

            Clients.All.InvokeAsync("TestSended", index);
            return Task.Factory.StartNew(() => "Hi return");
        }

        public Task<string> TestService(string clientMessage)
        {

            var responce = new
            {
                clientMessage = clientMessage,
                serverMessage = _myTestSrvice.GetMessage("test data from servers"),
            };
  
            Clients.All.InvokeAsync("Test", responce);
  
            return Task.Factory.StartNew(() => "Hi return");

        }

    }
}
