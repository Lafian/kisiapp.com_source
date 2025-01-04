let videoStream;
let image1;

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
            // Записываем результат в глобальную переменную image1
            image1 = event.target.result;
            console.log("Image successfully loaded:", image1);

            // Возвращаем результат для дальнейшего использования
            resolve(image1);
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

    image = canvas.toDataURL("image/png");
    return canvas.toDataURL("image/png");
}

async function preview() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image1;
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}