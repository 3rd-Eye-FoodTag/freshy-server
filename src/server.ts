import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './routes'
//firebase import 
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';
import { firebaseApp } from './firebase/config'; 

import * as admin from 'firebase-admin';


const app: Application = express();
const PORT = 2333;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

// Example Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is the TypeScript backend for your React Native app!');
});

app.post('/send-notification', async (req, res) => {
  const { title, body, topic } = req.body;

  const message = {
    notification: {
      title: title || 'Default Title',
      body: body || 'Default Body',
    },
    topic: topic || 'all_users', // Default to 'all_users' topic if none provided
  };

  try {
    // Send the notification
    const response = await firebaseApp.messaging().send(message);
    console.log('Notification sent successfully:', response);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ success: false, error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
