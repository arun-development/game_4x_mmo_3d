using System;

namespace Server.Core.Interfaces.AuthModule
{
    public interface IIdentityUser<TKey>
    {
        DateTimeOffset? LockoutEnd { get; set; }

        bool TwoFactorEnabled { get; set; }

        bool PhoneNumberConfirmed { get; set; }

        string PhoneNumber { get; set; }


        string ConcurrencyStamp { get; set; }

        string SecurityStamp { get; set; }

        string PasswordHash { get; set; }

        bool EmailConfirmed { get; set; }

        string NormalizedEmail { get; set; }


        string Email { get; set; }

        string NormalizedUserName { get; set; }

        string UserName { get; set; }

        TKey Id { get; set; }

        bool LockoutEnabled { get; set; }

        int AccessFailedCount { get; set; }

        string ToString();
    }


    public interface IApplicationUser : IIdentityUser<string>
    {

    }

 
}
