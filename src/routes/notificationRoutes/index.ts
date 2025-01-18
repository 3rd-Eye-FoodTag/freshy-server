import { Router, Request, Response } from 'express';
import { firebaseApp } from '../../firebase/config';

const router = Router();

router.post('/send-notification',  async (req: Request, res: Response): Promise<void>=> {
    const { title, body, topic } = req.body;
  
    const message = {
      notification: {
        title: title || 'Default Title',
        body: body || 'Default Body',
      },
      topic: topic || 'all_users', // Default to 'all_users' topic if none provided
    };
  
    try {
      const response = await firebaseApp.messaging().send(message);
      console.log('Notification sent successfully:', response);
      res.status(200).send({ success: true, response });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).send({ success: false, error });
    }
});

export default router;
