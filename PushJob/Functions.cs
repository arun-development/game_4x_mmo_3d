using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Newtonsoft.Json;

namespace PushJob
{
    public class Functions
    {
        // This function will get triggered/executed when a new message is written 
        // on an Azure Queue called queue.
        //public static void ProcessQueueMessage([QueueTrigger("queue")] string message, TextWriter log)
        //{



        //}
        [NoAutomaticTrigger]
        public async Task Push()
        {
            while (true)
            {

                await _callPush();
            }

        }

        private async Task _callPush() {
            try
            {
                //App Service Publish Profile Credentials 
                //string userName = "userName"; //userName 
                //string userPassword = "userPWD"; //userPWD 

                ////change webJobName to your WebJob name 
                //string webJobName = "WEBJOBNAME";

                //var unEncodedString = String.Format($"{userName}:{userPassword}");
                //var encodedString = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes(unEncodedString));

                //Change this URL to your WebApp hosting the  
                string URL = "https://skagry-net-core.azurewebsites.net/api/job/push";

        
                System.Net.WebRequest request = System.Net.WebRequest.Create(URL);
                request.Method = "GET";
                //request.ContentLength = 0;
                //request.Headers["Authorization"] = "Basic " + encodedString;
                System.Net.WebResponse response = await request.GetResponseAsync();
                var responseFromServer = "no responce";
                using (System.IO.Stream dataStream = response.GetResponseStream()) {
                    using (System.IO.StreamReader reader = new System.IO.StreamReader(dataStream)) {
                       responseFromServer = await reader.ReadToEndAsync();
                    }
                }            
 
                Console.WriteLine(responseFromServer);  //no response 

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
            }
            finally {
                await Task.Delay(30000);
                Console.WriteLine("run Next trigger:" + DateTime.UtcNow);
                
            }
        }
    }
}
