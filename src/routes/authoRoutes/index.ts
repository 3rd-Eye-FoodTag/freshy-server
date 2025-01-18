import { Router, Request, Response } from 'express';
import { handleLogin } from '../../api';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Fetch all users' });
  });
  
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = req.body;
    res.json({ message: 'User created', user });
  } catch (error) {
    console.error('Error logging in:', error);
  }
});

// Login route
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    // Call the loginAccount function
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

export default router;
