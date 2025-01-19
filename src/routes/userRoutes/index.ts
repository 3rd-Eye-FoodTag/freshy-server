import { Router, Request, Response } from 'express';
import { db } from '../../firebase/config';
import { UserInfo } from '../../utils/constant';
import { updateUserInfo } from '../../utils/utils';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Fetch all users' });
});

router.post('/', (req: Request, res: Response) => {
  const user = req.body;
  res.json({ message: 'User created', user });
});

router.get('/getuser/:uid', async (req: Request, res: Response): Promise<any> => {
  const { uid } = req.params;

  try {
    // Reference the document in the "Users" collection
    const docRef = db.collection('Users').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: `User with UID ${uid} not found` });
    }

    // Retrieve the user data
    const userData = docSnap.data();

    res.status(200).json(userData);
  } catch (error: any) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({
      message: 'Failed to fetch user data',
      error: error.message,
    });
  }
});

router.put('/updateUserInfo', async (req: Request, res: Response): Promise<any>  => {
  const { currentUid, updatedData }: { currentUid: string; updatedData: Partial<UserInfo> } =
    req.body;

  if (!currentUid || !updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    // Update the user's information
    await updateUserInfo(currentUid, updatedData);

    return res.status(200).json({
      message: `User information for ${currentUid} has been updated successfully.`,
    });
  } catch (error) {
    console.error('Error updating user information:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updateWeeklyWrapTime',  async (req: Request, res: Response): Promise<any>  => {
  try {
      // Extract data from request body
      const { uid, weeklyWrapTime } = req.body;

      // Validate input
      if (!uid || !weeklyWrapTime || !weeklyWrapTime.Days || !weeklyWrapTime.Times) {
          return res.status(400).json({ error: 'Invalid input. uid and weeklyWrapTime (Days, Times) are required.' });
      }

      // Reference to the user document
      const userDocRef = db.collection('Users').doc(uid);

      // Check if user exists
      const userDoc = await userDocRef.get();
      if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update the weeklyWrapTime field
      await userDocRef.update({
          'setting.weeklyWrapTime': {
              Days: weeklyWrapTime.Days,
              Times: weeklyWrapTime.Times,
          },
      });

      res.status(200).json({ message: 'Weekly wrap time updated successfully' });
  } catch (error) {
      console.error('Error updating weekly wrap time:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;
