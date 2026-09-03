import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware';

const app = express();

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
app.listen(PORT, () => {
  console.log(`🚀 RIDEEL Backend server running on http://localhost:${PORT}`);
});
