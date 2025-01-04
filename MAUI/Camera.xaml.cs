using CommunityToolkit.Maui.Views;
using CommunityToolkit.Maui.Core;

namespace MAUI
{
    public partial class Camera : ContentPage
    {
        public Camera()
        {
            InitializeComponent();
            InitializeCamera();
        }

        private async void InitializeCamera()
        {
            try
            {
                var status = await Permissions.CheckStatusAsync<Permissions.Camera>();
                if (status != PermissionStatus.Granted)
                {
                    status = await Permissions.RequestAsync<Permissions.Camera>();
                    if (status != PermissionStatus.Granted)
                    {
                        ShowError("Нет разрешения на использование камеры");
                        return;
                    }
                }

                var cameras = await cameraView.GetAvailableCameras(CancellationToken.None);
                if (cameras.Count > 0)
                {
                    cameraView.SelectedCamera = cameras[0]; // Выбираем первую доступную камеру
                    await cameraView.StartCameraPreview(CancellationToken.None);
                }
            }
            catch (Exception ex)
            {
                ShowError($"Ошибка инициализации камеры: {ex.Message}");
            }
        }

        private void ShowError(string message)
        {
            errorMessage.Text = message;
            errorOverlay.IsVisible = true;
            cameraView.IsEnabled = false;
        }

        private void OnRetryClicked(object sender, EventArgs e)
        {
            errorOverlay.IsVisible = false;
            InitializeCamera();
        }

        private async void OnCaptureClicked(object sender, EventArgs e)
        {
            try
            {
                cameraView.CaptureImageCommand.Execute(CancellationToken.None);
                // или используйте напрямую метод
                // await cameraView.CaptureImage(CancellationToken.None);
            }
            catch (Exception ex)
            {
                ShowError($"Ошибка при съемке фото: {ex.Message}");
            }
        }

        private void cameraView_MediaCaptured(object sender, MediaCapturedEventArgs e)
        {
            // Обработка захваченного изображения
            using var stream = e.Media;
            // Здесь можно сохранить или обработать изображение
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();
            cameraView.StopCameraPreview();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            InitializeCamera();
        }
    }
}