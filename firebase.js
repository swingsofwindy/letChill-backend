const admin=require('firebase-admin')
const serviceAccount = require(process.env.FIREBASE_KEY_PATH); 

if (!admin.apps.length) {
  admin.initializeApp({  
      projectId: process.env.FIREBASE_PROJECT_ID,
      credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

module.exports={
    admin,
    db
}