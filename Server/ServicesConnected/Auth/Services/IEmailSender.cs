using System.Threading.Tasks;

namespace Server.ServicesConnected.Auth.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
