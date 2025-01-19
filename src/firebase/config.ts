import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';

import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: "AIzaSyBYyGwCHKviq3olXksJWi4c7xSR_GVGoMg",
    authDomain: "freshfoodv1.firebaseapp.com",
    projectId: "freshfoodv1",
    storageBucket: "freshfoodv1.appspot.com",
    messagingSenderId: "614037993814",
    appId: "1:614037993814:web:5c7b0c04917c9596647ef7",
    measurementId: "G-PG8JHCPF55"
};

const serviceAccountBase64: string | undefined = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountBase64) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
}

const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
);

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "freshfoodv1.appspot.com",
});

const app = initializeApp(firebaseConfig)
export const db = admin.firestore()
export const auth = admin.auth();
export const storage = getStorage(app);

export const getFoodImageURL = async (imageName: string) => {
    const pathReference = ref(storage, `images/foodWiki/${imageName}.png`);
    const url = await getDownloadURL(pathReference);

    return url;
};

export const handlePostNotification = async () => {
  try {
    const db = admin.firestore();

    // Step 1: Write a new test document to the `Inventory` collection
    const testDocRef = db.collection('Inventory').doc('TestDocument');
    await testDocRef.set({
      data: [
        {
          foodID: 'testID123',
          foodName: 'Test Food',
          category: 'Groceries',
          cost: 10.99,
          expiryDate: '2025-12-31',
          created: new Date().toISOString(),
        },
      ],
    });
    console.log('Successfully wrote to Firestore (Inventory collection).');

    // Step 2: Read the test document back
    const docSnapshot = await testDocRef.get();
    if (docSnapshot.exists) {
      console.log('Retrieved Firestore document:', docSnapshot.data());
    } else {
      console.error('Test document does not exist.');
    }

    // Step 3: Update the document (add a new item to the `data` array)
    await testDocRef.update({
      data: admin.firestore.FieldValue.arrayUnion({
        foodID: 'testID456',
        foodName: 'Another Test Food',
        category: 'Dairy',
        cost: 5.49,
        expiryDate: '2025-11-30',
        created: new Date().toISOString(),
      }),
    });
    console.log('Successfully updated Firestore document.');

    // Step 4: Delete the test document
    await testDocRef.delete();
    console.log('Successfully deleted the test document.');

  } catch (error) {
    console.error('Error testing Firestore Inventory:', error);
  }
};
