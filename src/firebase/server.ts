import * as admin from 'firebase-admin';

export function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    // When running in a Google Cloud environment, the SDK can automatically
    // detect the service account credentials.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

// We are conditionally exporting these to be used in server environments.
// This helps with tree-shaking on the client.
let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

if (process.env.NEXT_RUNTIME === 'nodejs') {
  initializeFirebaseAdmin();
  db = admin.firestore();
  auth = admin.auth();
}

export { db, auth };
