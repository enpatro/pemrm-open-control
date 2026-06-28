# PE-3F KPI Direct Content App - No Login

Open index.html directly. No login page.

IMPORTANT Firebase rule required because no authentication is used:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

This is only for internal testing. Later admin/user control can be added.

Also update firebase-config.js with exact Firebase Web App config.
