namespace MAUI;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        // Регистрируем роуты для навигации
        Routing.RegisterRoute(nameof(Camera), typeof(Camera));
    }
}