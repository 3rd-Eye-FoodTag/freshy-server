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


export default router;
