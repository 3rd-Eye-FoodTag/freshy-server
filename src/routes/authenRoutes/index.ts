import { Router, Request, Response } from 'express';
import { registerAccount, handleLogin } from '../../api';

const router = Router();

// Login route
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
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

export default router;
