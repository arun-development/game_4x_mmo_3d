using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Server.ServicesConnected.Auth.Services;

namespace Server.ServicesConnected.Auth.Extensions
{
    public static class EmailSenderExtensions
    {

        static EmailSenderExtensions() { }
        public static string EmailForTesting;
        public static Task SendEmailConfirmationAsync(this IEmailSender emailSender, string email, string link)
        {
            return emailSender.SendEmailAsync(email, "Confirm your email",
                $"Please confirm your account by clicking this link: <a href='{HtmlEncoder.Default.Encode(link)}'>link</a>");
        }
 

        public static Task SendTestMessage(this IEmailSender emailSender, string messageHtmlContent)
        {
                      
            return emailSender.SendEmailAsync(EmailForTesting, "skagry test", messageHtmlContent);
        }



    }
}
