import { Router } from 'express';
import { isAuth } from '../controllers/authContoller.js';
import {
  createConversation,
  getAllConversations,
} from '../controllers/conversationController.js';

const router = Router();

router
  .route('/')
  .get(isAuth, getAllConversations)
  .post(isAuth, createConversation);

export default router;
