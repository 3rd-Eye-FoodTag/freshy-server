import { Router } from 'express';
import userRouter from './userRoutes';
import authenRoutes from './authenRoutes';
import inventoryRoutes from './inventoryRoutes'

const apiRouter = Router();

apiRouter.use('/users', userRouter); 
apiRouter.use('/auth', authenRoutes);
apiRouter.use('/inventory', inventoryRoutes);

export default apiRouter;
