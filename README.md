# PEMRM1 Internal Only KPI App

No admin page. No role control. All authenticated users can update internal KPI data.

Required Firebase Firestore rule for internal testing:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

Important: Update firebase-config.js with exact Web App config from Firebase Console.
