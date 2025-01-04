let videoStream;

async function processSelectedFile(inputId) {
    return new Promise((resolve, reject) => {
        const inputFile = document.getElementById(inputId);
        if (!inputFile || !inputFile.files || inputFile.files.length === 0) {
            reject("No file selected");
            return;
        }

        const file = inputFile.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            // Возвращаем содержимое файла в Base64 формате
            resolve(event.target.result);
        };

        reader.onerror = (error) => {
            reject(`Error reading file: ${error}`);
        };

        // Читаем файл как Data URL (Base64)
        reader.readAsDataURL(file);
    });
}

window.startCamera = async function () {
    try {
        const constraints = { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoStream = document.getElementById('cameraVideo');
        videoStream.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

function stopCamera() {
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach((track) => track.stop());
        videoStream = null;
    }
}

async function capturePhoto() {
    const videoElement = document.getElementById("cameraVideo");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    stopCamera();

    return canvas.toDataURL("image/png");
}