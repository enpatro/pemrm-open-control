MMR PPT Upload + Compile Patch

Upload all files to GitHub root.
Must keep firebase-config.js real format: const firebaseConfig = {...}

New pages:
- department-ppt.html : upload PPT/PPTX below 10MB for UM, UE, FA Maint, FB Maint, Safety, Env
- compiled-report.html : download compiled MMR - selected month PPTX

Firebase Storage rules are required for upload:
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}

Firestore rules also required for no-login mode:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if true; }
  }
}

Note:
Browser export cannot truly merge uploaded PPT slides into one deck without backend processing.
This version adds KPI + Abs/OT slides and department section slides with source PPT links.
For true slide-level merging, use Power Automate/SharePoint backend or server-side Python.
