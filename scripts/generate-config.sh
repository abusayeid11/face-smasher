#!/bin/bash

# Create the folder if it doesn't exist
mkdir -p js

# The content of the file with exports
CONTENT="export const FIREBASE_CONFIG = {
  apiKey: '$apiKey',
  authDomain: '$authDomain',
  databaseURL: '$databaseURL',
  projectId: '$projectId',
  storageBucket: '$storageBucket',
  messagingSenderId: '$messagingSenderId',
  appId: '$appId'
};

export const CLOUDINARY_CLOUD_NAME = '$CLOUDINARY_CLOUD_NAME';
export const CLOUDINARY_UPLOAD_PRESET = '$CLOUDINARY_UPLOAD_PRESET';"

# Save it to the root folder (fixes the ../config.js error)
echo "$CONTENT" > config.js

# Save a copy to the js folder (just in case)
echo "$CONTENT" > js/config.js

echo "Config files generated with exports!"