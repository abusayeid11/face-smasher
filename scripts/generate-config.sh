#!/bin/bash

mkdir -p js

echo "const FIREBASE_CONFIG = {
  apiKey: '$API_KEY',
  authDomain: '$AUTH_DOMAIN',
  databaseURL: '$DATABASE_URL',
  projectId: '$PROJECT_ID',
  storageBucket: '$STORAGE_BUCKET',
  messagingSenderId: '$MESSAGING_SENDER_ID',
  appId: '$APP_ID'
};

const CLOUDINARY_CLOUD_NAME = '$CLOUDINARY_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = '$CLOUDINARY_UPLOAD_PRESET';" > js/config.js

echo "Config file generated!"