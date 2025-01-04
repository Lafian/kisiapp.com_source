using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAUI.Services
{
    public interface IPasskeyService
    {
        Task<bool> IsPasskeyAvailableAsync();
        Task<string> CreatePasskeyAsync(string username, string origin);
        Task<string> SignInWithPasskeyAsync(string origin);
    }
}
