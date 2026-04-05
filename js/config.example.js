// Secrets live in .env — run `node scripts/gen-config.js` to generate this file.
// js/config.js is gitignored — never commit real credentials.

export const FIREBASE_CONFIG = {
    apiKey:            "YOUR_FIREBASE_API_KEY",
    authDomain:        "YOUR_PROJECT.firebaseapp.com",
    databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

export const CLOUDINARY_CLOUD_NAME    = "your_cloud_name";
export const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset";
