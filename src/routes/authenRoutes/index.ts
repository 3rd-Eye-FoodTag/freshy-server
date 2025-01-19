import { Router, Request, Response } from 'express';
import { registerAccount, handleLogin } from '../../api';
import { auth }from '../../firebase/config'
import { db } from '../../firebase/config';

const router = Router();

//because the restful api won't update the onAuthStateChange at client side
//we would use react-native-firebase-for-auth, may create own onAuthStateChange in future
// Log Out route
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("a user is trying to logining")
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await handleLogin({ email: email, password: password});

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Registration Route
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Call your `registerAccount` function
    const result = await registerAccount({ email, password });

    // Respond with success
    return res.status(200).json({
      message: 'User registered successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error registering user:', error.message);

    // Handle Firebase errors
    return res.status(500).json({
      message: 'Registration failed.',
      error: error.message,
    });
  }
});

//register tell more information 

// Route to handle user registration and Firestore data setup
router.post('/createUserDetailsInfo', async (req: Request, res: Response): Promise<any>  => {
  const { email, name, age, zipCode, gender, uid } = req.body;
  try {
    console.log({email, name, age, zipCode, gender, uid})
    await db.collection('Users').doc(uid).set({
      name,
      age,
      zipCode,
      gender,
      email: email,
      uid: uid,
      createdAt: new Date(),
      // phoneNubmer: null
    });

    // Add an empty inventory for the user in Firestore
    await db.collection('Inventory').doc(uid).set({
      data: [],
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: uid,
        email: email,
        name,
      },
    });
  } catch (error: any) {
    console.error('Error registering user:', error.message);
    res.status(400).json({ error: error.message });
  }
});


export default router;
