import { Router } from 'express';
import healthRoutes from './health.routes';
import dbTestRoutes from './dbTest.routes';
import userRoutes from './user.routes';
import deliveryRoutes from './delivery.routes';
import matchRequestRoutes from './matchRequest.routes';
import authRoutes from '../auth/auth.routes';

import pricingRoutes from '../pricing/pricing.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', healthRoutes);
router.use('/', dbTestRoutes);
router.use('/', userRoutes);
router.use('/', deliveryRoutes);
router.use('/', matchRequestRoutes);
router.use('/', pricingRoutes);

export default router;
