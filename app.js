import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import userRouter from './routes/userRoutes.js';
import conversationRouter from './routes/conversationRoutes.js';
import messageRouter from './routes/messageRoutes.js';

import authRouter from './routes/authRoutes.js';
import AppError from './utils/appError.js';

import globalErrorHandler from './controllers/errorController.js';

dotenv.config();

const DB = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.MONGODB_PASSWORD
);
mongoose.connect(DB).then(() => console.log('DB connection successfull'));

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);

// Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
