import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config.js';

async function uploadToCloudinary(dataURL) {
    const formData = new FormData();
    formData.append('file', dataURL);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );
    
    if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.secure_url;
}

async function convertToWebP(imageUrl, quality = 0.8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/webp', quality));
        };
        img.onerror = () => resolve(imageUrl);
        img.src = imageUrl;
    });
}

export function setupFileInput(inputId, buttonId, onFileLoaded, accept = 'image/*') {
    const fileInput = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (!fileInput || !button) {
        console.warn(`File input ${inputId} or button ${buttonId} not found`);
        return;
    }
    
    fileInput.accept = accept;
    
    button.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            onFileLoaded(event.target.result);
        };
        reader.readAsDataURL(file);
    });
}

export async function processAndUploadImages(faceDataUrl, bgDataUrl) {
    const uploadFace = convertToWebP(faceDataUrl, 0.8).then(url => uploadToCloudinary(url));
    const uploadBg = bgDataUrl 
        ? convertToWebP(bgDataUrl, 0.8).then(url => uploadToCloudinary(url))
        : Promise.resolve('');
    
    const [faceUrl, bgUrl] = await Promise.all([uploadFace, uploadBg]);
    return { faceUrl, bgUrl };
}

export async function convertToWebPOnly(dataUrl) {
    return convertToWebP(dataUrl, 0.8);
}