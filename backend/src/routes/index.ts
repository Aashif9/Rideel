import { Router } from 'express';
import healthRoutes from './health.routes';
import dbTestRoutes from './dbTest.routes';
import userRoutes from './user.routes';
import deliveryRoutes from './delivery.routes';
import authRoutes from '../auth/auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', healthRoutes);
router.use('/', dbTestRoutes);
router.use('/', userRoutes);
router.use('/', deliveryRoutes);

export default router;
