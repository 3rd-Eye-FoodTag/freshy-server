import { Router } from 'express';
import userRouter from './userRoutes';
import authenRoutes from './authenRoutes';
import inventoryRoutes from './inventoryRoutes'
import notificationRoutes from './notificationRoutes'

const apiRouter = Router();

apiRouter.use('/users', userRouter); 
apiRouter.use('/auth', authenRoutes);
apiRouter.use('/inventory', inventoryRoutes);
apiRouter.use('/notification', notificationRoutes);

export default apiRouter;
