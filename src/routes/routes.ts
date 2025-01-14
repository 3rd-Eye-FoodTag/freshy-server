import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Fetch all users' });
});

router.post('/', (req: Request, res: Response) => {
  const user = req.body;
  res.json({ message: 'User created', user });
});

export default router;
