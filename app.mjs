import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from 'passport';
import './stratergies/localStratergy.mjs';

import authRouter from './routes/authRoutes.mjs';
import userRouter from './routes/userRoutes.mjs';
import conversationRouter from './routes/conversationRoutes.mjs';
import messageRouter from './routes/messageRoutes.mjs';

import globalErrorHandler from './controllers/errorController.mjs';
import AppError from './utils/appError.mjs';

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
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: DB }),
    cookie: {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'none',
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
