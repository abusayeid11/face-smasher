import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config.js';

function applyCropTransform(url, info) {
    const coords = info?.coordinates?.custom?.[0];
    if (!coords) return url;
    const [x, y, w, h] = coords;
    return url.replace('/upload/', `/upload/c_crop,h_${h},w_${w},x_${x},y_${y}/`);
}

export function createUploadWidget(onSuccess, extraOptions = {}) {
    return cloudinary.createUploadWidget(
        {
            cloudName:        CLOUDINARY_CLOUD_NAME,
            uploadPreset:     CLOUDINARY_UPLOAD_PRESET,
            sources:          ['local', 'camera'],
            multiple:         false,
            maxImageFileSize: 5_000_000,
            ...extraOptions,
        },
        (err, result) => {
            if (!err && result?.event === 'success') {
                const url = applyCropTransform(result.info.secure_url, result.info);
                onSuccess(url);
            }
        }
    );
}
