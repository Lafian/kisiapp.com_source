using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace WASM.Services
{
    public class CustomAuthenticationService
    {
        private readonly HttpClient _httpClient;
        private readonly CustomAuthStateProvider _authStateProvider;

        public CustomAuthenticationService(HttpClient httpClient, CustomAuthStateProvider authStateProvider)
        {
            _httpClient = httpClient;
            _authStateProvider = authStateProvider;
        }

        // Метод регистрации
        public async Task<(bool IsSuccess, string Message)> Register(string email, string password)
        {
            // Создаем объект для отправки JSON
            var registerPayload = new
            {
                email,
                password
            };

            try
            {
                // Добавляем ключ подписки в заголовки запроса
                _httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "8634e982777842fdb305d0d6b87c45ff");
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
                // Выполняем POST-запрос к API
                var response = await _httpClient.PostAsJsonAsync("https://kisiappapi.azure-api.net/signup", registerPayload);
                
                if (response.IsSuccessStatusCode)
                {
                    // Читаем JSON-ответ
                    var result = await response.Content.ReadFromJsonAsync<RegisterResponse>();

                    if (result != null && result.Code == 200)
                    {
                        // Сохраняем токен или выполняем дополнительные действия
                        await _authStateProvider.MarkUserAsAuthenticatedAsync(result.Token); // Используем асинхронный метод

                        return (true, "Registration succeeded");
                    }

                    return (false, result?.Details ?? "Unknown error during registration");
                }
                else
                {
                    // Если код ответа HTTP не успешный
                    var error = await response.Content.ReadAsStringAsync();
                    return (false, $"Registration failed: {error}");
                }
            }
            catch (Exception ex)
            {
                // Обработка исключений
                return (false, $"Exception occurred: {ex.Message}");
            }
        }

        // Метод входа в систему
        public async Task<(bool IsSuccess, string Message)> Login(string email, string password)
        {
            // Создаем объект для отправки JSON
            var loginPayload = new
            {
                email,
                password
            };

            try
            {
                // Добавляем ключ подписки в заголовки запроса
                _httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "8634e982777842fdb305d0d6b87c45ff");
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                // Выполняем POST-запрос к API
                var response = await _httpClient.PostAsJsonAsync("https://kisiappapi.azure-api.net/signin", loginPayload);

                if (response.IsSuccessStatusCode)
                {
                    // Читаем JSON-ответ
                    var result = await response.Content.ReadFromJsonAsync<LoginResponse>();

                    if (result != null && result.Code == 200)
                    {
                        // Сохраняем токен или выполняем дополнительные действия
                        await _authStateProvider.MarkUserAsAuthenticatedAsync(result.Token);

                        return (true, "Login succeeded");
                    }

                    return (false, result?.Details ?? "Unknown error during login");
                }
                else
                {
                    // Если код ответа HTTP не успешный
                    var error = await response.Content.ReadAsStringAsync();
                    return (false, $"Login failed: {error}");
                }
            }
            catch (Exception ex)
            {
                // Обработка исключений
                return (false, $"Exception occurred: {ex.Message}");
            }
        }

        public async Task Logout()
        {
            await _authStateProvider.MarkUserAsLoggedOutAsync(); // Асинхронный вызов
        }

        // Модель для обработки ответа от API регистрации
        private class RegisterResponse
        {
            public int Code { get; set; }
            public string Details { get; set; }
            public string Token { get; set; }
        }
        private class LoginResponse
        {
            public int Code { get; set; }
            public string Details { get; set; }
            public string Token { get; set; }
        }
    }
}