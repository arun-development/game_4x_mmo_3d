using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Server.ServicesConnected.Auth.Models.AccountViewModels
{
 
    public abstract class BaseLoginViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public virtual string Email { get; set; }


        [Required]
        [StringLength(14, ErrorMessage = "Значение {0} должно содержать не менее {2} символов.", MinimumLength = 4)]
        [Display(Name = "Имя персонажа")]
        public virtual string UserName { get; set; }
    }

    public class ExternalLoginViewModel: BaseLoginViewModel
    {
        [ReadOnly(true)]
        public override string Email { get; set; }
        public   string ExternalProviderName { get; set; }
    }
    public class RegisterViewModel: BaseLoginViewModel
    {

        [Required]
        [StringLength(20, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
    public class CreateEmailMessageViewModel: BaseLoginViewModel
    {
        public bool EmailReadOnly { get; set; }
    }

}
