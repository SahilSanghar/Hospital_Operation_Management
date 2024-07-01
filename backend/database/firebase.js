// firebase.js
import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json' assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hospital-operation-management.firebaseio.com',
    ignoreUndefinedProperties: true, 
});

const db = admin.firestore();

export { db };
