using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using Server.ServicesConnected.Auth.Models;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Server.ServicesConnected.Auth.Services
{
    //2 f auth Twilio Programmable SMS allows you to: https://www.twilio.com/docs/quickstart/csharp/sms#overview

    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    //https://dotnetthoughts.net/send-mail-using-sendgrid-in-dotnet-core/
    //https://sendgrid.com/docs/Integrate/Code_Examples/v2_Mail/csharp.html
    //https://docs.microsoft.com/ru-ru/aspnet/core/security/authentication/accconfirm?tabs=aspnetcore2x%2Csql-server

    public interface ISmsSender
    {
        Task SendSmsAsync(string number, string message);
    }


    public class EmailSender : IEmailSender, ISmsSender
    {
        public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            await Execute(Options.SendGridKey, subject, message, email);
        }

        public async Task SendSmsAsync(string number, string message)
        {
            TwilioClient.Init(Options.TwilioSMSAccountIdentification, Options.TwilioSMSAccountPassword);
            var msg = MessageResource.Create(
                new PhoneNumber(number),
                @from: new PhoneNumber(Options.TwilioSMSAccountFromPhoneNumber),
                body: message);
            await Task.FromResult(0);
        }

        public async Task Execute(string apiKey, string subject, string message, string email)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage
            {
                From = new EmailAddress("info@skagry.com", "Skagry Team"),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));
            await client.SendEmailAsync(msg);
        }
    }
}