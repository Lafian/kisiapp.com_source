using CommunityToolkit.Maui;
using MAUI.Services;
using Microsoft.Extensions.Logging;


namespace MAUI
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .UseMauiCommunityToolkit()
                .UseMauiCommunityToolkitCamera()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                });

            builder.Services.AddMauiBlazorWebView();

#if DEBUG
            builder.Services.AddBlazorWebViewDeveloperTools();
    		builder.Logging.AddDebug();
            builder.Services.AddSingleton<IPasskeyService, AndroidPasskeyService>();
#endif
            builder.Services.AddSingleton<HttpClient>();

#if ANDROID
#endif
            return builder.Build();
        }
    }
}
