import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:', process.env.PORT);
});