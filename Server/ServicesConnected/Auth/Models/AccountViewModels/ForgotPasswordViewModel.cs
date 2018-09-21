using System.ComponentModel.DataAnnotations;

namespace Server.ServicesConnected.Auth.Models.AccountViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
