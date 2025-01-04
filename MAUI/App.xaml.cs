namespace MAUI
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
            MainPage = new AppShell();
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            var window = new Window(MainPage) { Title = "MAUI" };

            // Если нужно установить размеры окна
            window.Width = 1200;
            window.Height = 800;
            window.X = 100;
            window.Y = 100;

            return window;
        }
    }
}