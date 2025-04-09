import cors from 'cors';
import express from 'express';
import { errorHandler } from '../domain/interfaces/middleware/errorHandler';
// import { setupSwagger } from '../interface/swagger';
import { accessCheckoutRoutes } from '../interface/routes/accessCheckoutRoutes';
import { kidsCheckoutRoutes } from '../interface/routes/kidsCheckoutRoute';
import { activityCheckoutRoutes } from '../interface/routes/activityCheckoutRoutes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(
  '/api',
  accessCheckoutRoutes,
  kidsCheckoutRoutes,
  activityCheckoutRoutes,
);
app.use(errorHandler);
// setupSwagger(app);

export default app;
