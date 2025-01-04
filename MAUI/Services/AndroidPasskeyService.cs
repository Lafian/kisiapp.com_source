
using Fido2NetLib.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Maui.Controls;

using Microsoft.Maui.ApplicationModel;
using Microsoft.Extensions.Logging;
using Microsoft.Maui.Authentication;

namespace MAUI.Services
{
    public class AndroidPasskeyService : IPasskeyService
    {
        private readonly ILogger<AndroidPasskeyService> _logger;

        public AndroidPasskeyService(ILogger<AndroidPasskeyService> logger)
        {
            _logger = logger;
        }

        public Task<bool> IsPasskeyAvailableAsync()
        {
            // В MAUI нет прямого метода для проверки доступности Passkey.
            // Мы можем проверить версию Android, так как Passkey поддерживается с Android 9 (API 28)
            return Task.FromResult(OperatingSystem.IsAndroidVersionAtLeast(28));
        }

        public async Task<string> CreatePasskeyAsync(string username, string origin)
        {
            try
            {
                var options = new WebAuthenticatorOptions
                {
                    Url = new Uri($"{origin}/register?username={Uri.EscapeDataString(username)}"),
                    CallbackUrl = new Uri("myapp://")
                };

                var result = await WebAuthenticator.Default.AuthenticateAsync(options);

                // Предполагаем, что сервер возвращает данные регистрации в параметре 'registration_response'
                if (result.Properties.TryGetValue("registration_response", out var registrationResponse))
                {
                    return registrationResponse;
                }
                else
                {
                    _logger.LogError("Registration response not found in the result");
                    return null;
                }
            }
            catch (TaskCanceledException)
            {
                _logger.LogInformation("User canceled the registration");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating passkey");
                return null;
            }
        }

        public async Task<string> SignInWithPasskeyAsync(string origin)
        {
            try
            {
                var options = new WebAuthenticatorOptions
                {
                    Url = new Uri($"{origin}/login"),
                    CallbackUrl = new Uri("myapp://")
                };

                var result = await WebAuthenticator.Default.AuthenticateAsync(options);

                // Предполагаем, что сервер возвращает данные аутентификации в параметре 'authentication_response'
                if (result.Properties.TryGetValue("authentication_response", out var authenticationResponse))
                {
                    return authenticationResponse;
                }
                else
                {
                    _logger.LogError("Authentication response not found in the result");
                    return null;
                }
            }
            catch (TaskCanceledException)
            {
                _logger.LogInformation("User canceled the sign-in");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error signing in with passkey");
                return null;
            }
        }
    }
}
