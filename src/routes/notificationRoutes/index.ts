import { Router, Request, Response } from 'express';
import { firebaseApp } from '../../firebase/config';
import { calculateExpiredFoods } from '../../utils/utils';

const router = Router();

router.post('/send-notification', async (req: Request, res: Response): Promise<void> => {
  const { userId, title, topic } = req.body;

  if (!userId) {
    res.status(400).send({ error: 'User ID is required' });
  }

  try {
    // Calculate expired food count
    const expiredCount = await calculateExpiredFoods(userId);

    // Prepare notification content
    const body = `You have ${expiredCount} food item(s) that are expired. Please review your inventory.`;

    const message = {
      notification: {
        title: title || 'Food Expiry Alert',
        body: body,
      },
      topic: topic || 'all_users', // Default to 'all_users' topic if none provided
    };

    // Send the notification
    const response = await firebaseApp.messaging().send(message);
    console.log('Notification sent successfully:', response);

    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ success: false, error });
  }
});

export default router;
