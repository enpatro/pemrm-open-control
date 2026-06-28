# PE-3F KPI + Abs & OT Direct App - Offline Safe

No login. KPI, Abs & OT entry, dashboard, Excel download and PPT download included.

## Firebase rule for no-login mode
Firestore Database > Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

## Important
1. Replace firebase-config.js with exact config from Firebase Web App.
2. If Firebase gives 'client is offline', this app still saves to browser localStorage.
3. For multi-user live data, Firebase config and Firestore rules must be correct.
4. Excel download is .xls format and opens in Excel.
5. PPT download is .ppt HTML format and opens in PowerPoint.
