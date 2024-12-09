import express from 'express';
import { createServer } from 'node:http';
import routes from '@/routes/rest';

const app = express();
app.use('/api', express.json());
app.use('/api', routes);

const server = createServer(app);

export default server;
export { app };
