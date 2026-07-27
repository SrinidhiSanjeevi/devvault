import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import client from 'prom-client';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import { httpLogger } from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import snippetRoutes from './routes/snippetRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import commandRoutes from './routes/commandRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(httpLogger);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 750, 1000, 2000, 5000],
});

// Middleware for metrics
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
  });
  next();
});

// DevOps Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/ready', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  if (dbStatus === 1) {
    res.status(200).json({ status: 'READY', db: 'CONNECTED' });
  } else {
    res.status(503).json({ status: 'UNAVAILABLE', db: 'DISCONNECTED' });
  }
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.get('/version', (req, res) => {
  res.status(200).json({ version: process.env.npm_package_version || '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notes', noteRoutes);

// Error Handler
app.use(errorHandler);

export default app;
