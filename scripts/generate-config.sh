#!/bin/bash

# Create the folder if it doesn't exist
mkdir -p js

# The content of the file (Note the word EXPORT before every variable)
CONTENT="export const FIREBASE_CONFIG = {
  apiKey: '$API_KEY',
  authDomain: '$AUTH_DOMAIN',
  databaseURL: '$DATABASE_URL',
  projectId: '$PROJECT_ID',
  storageBucket: '$STORAGE_BUCKET',
  messagingSenderId: '$MESSAGING_SENDER_ID',
  appId: '$APP_ID'
};

export const CLOUDINARY_CLOUD_NAME = '$CLOUDINARY_CLOUD_NAME';
export const CLOUDINARY_UPLOAD_PRESET = '$CLOUDINARY_UPLOAD_PRESET';"

# Save it to the root folder (fixes the ../config.js error)
echo "$CONTENT" > config.js

# Save a copy to the js folder (just in case)
echo "$CONTENT" > js/config.js

echo "Config files generated with exports!"