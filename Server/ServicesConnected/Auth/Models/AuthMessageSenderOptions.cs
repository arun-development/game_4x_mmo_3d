using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Infrastructure;
using Twilio.Rest.Api.V2010;
using System;

namespace Server.ServicesConnected.Auth.Models
{



    public class AuthMessageSenderOptions : AppConfigSectionReader
    {
        public AuthMessageSenderOptions() : base(nameof(AuthMessageSenderOptions))
        {
        }


        public string SendGridKey { get; set; }
        // ReSharper disable once InconsistentNaming
        public string TwilioSMSAccountIdentification { get; set; }
        // ReSharper disable once InconsistentNaming
        public string TwilioSMSAccountPassword { get; set; }
        // ReSharper disable once InconsistentNaming
        public string TwilioSMSAccountFromPhoneNumber { get; set; }
        public string FacebookSecret { get; set; }

        public string FacebookAppId { get; set; }
        public string GoogleClientId { get; set; }
        public string GoogleClientSecret { get; set; }
        public string MicrosoftClientId { get; set; }
        public string MicrosoftSecret { get; set; }

        /// <summary>
        /// NotImplemented
        /// </summary>
        public string VKAppId { get; set; }
        /// <summary>
        /// NotImplemented
        /// </summary>
        public string VKSecret { get; set; }

      
        public override void Create(IConfiguration configuration)
        {
            var data = GetFromConfig(configuration);
        }

        public void  SetFromOther(AuthMessageSenderOptions data) {
            if (data== null) {
                return;
            }
            FacebookAppId = data.FacebookAppId;
            FacebookSecret = data.FacebookSecret;
            GoogleClientId = data.GoogleClientId;
            GoogleClientSecret = data.GoogleClientSecret;
            MicrosoftClientId = data.MicrosoftClientId;
            MicrosoftSecret = data.MicrosoftSecret;
            SendGridKey = data.SendGridKey;
            TwilioSMSAccountFromPhoneNumber = data.TwilioSMSAccountFromPhoneNumber;
            TwilioSMSAccountIdentification = data.TwilioSMSAccountIdentification;
            TwilioSMSAccountPassword = data.TwilioSMSAccountPassword;
            VKAppId = data.VKAppId;
            VKSecret = data.VKSecret;
 
        }

        public static AuthMessageSenderOptions GetFromConfig(IConfiguration configuration) {
            return configuration.GetSection(nameof(AuthMessageSenderOptions)).Get<AuthMessageSenderOptions>();
        }

    }
}
