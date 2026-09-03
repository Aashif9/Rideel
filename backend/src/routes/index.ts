import { Router } from 'express';
import healthRoutes from './health.routes';
import dbTestRoutes from './dbTest.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/', dbTestRoutes);

export default router;
