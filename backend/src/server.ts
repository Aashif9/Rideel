import http from 'http';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware';
import { seedDatabaseIfEmpty } from './config/seedDatabase';
import { initializeTrackingSocket } from './tracking/tracking.socket';
import { trackingService } from './tracking/tracking.service';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Real-Time GPS Tracking Engine
initializeTrackingSocket(server);

// Configure CORS for Frontend development URL (http://localhost:3000)
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// API Routes aggregator (supports both /api/health and /health)
app.use('/api', routes);
app.use('/', routes);

// Central error handling middleware
app.use(errorHandler);

const PORT = parseInt(env.PORT, 10);
server.listen(PORT, async () => {
  console.log(`🚀 RIDEEL Backend server running on http://localhost:${PORT}`);
  await seedDatabaseIfEmpty();
});
