import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';

import * as admin from 'firebase-admin';

const firebaseConfig = {
    apiKey: "AIzaSyBYyGwCHKviq3olXksJWi4c7xSR_GVGoMg",
    authDomain: "freshfoodv1.firebaseapp.com",
    projectId: "freshfoodv1",
    storageBucket: "freshfoodv1.appspot.com",
    messagingSenderId: "614037993814",
    appId: "1:614037993814:web:5c7b0c04917c9596647ef7",
    measurementId: "G-PG8JHCPF55"
};

const serviceAccount = require('../utils/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'freshfoodv1.appspot.com',
});

const app = initializeApp(firebaseConfig)
export const db = getFirestore();
export const auth = admin.auth();
export const storage = getStorage(app);

export const getFoodImageURL = async (imageName: string) => {
    const pathReference = ref(storage, `images/foodWiki/${imageName}.png`);
    const url = await getDownloadURL(pathReference);

    return url;
};
  