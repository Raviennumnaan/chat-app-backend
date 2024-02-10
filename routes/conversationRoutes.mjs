import { Router } from 'express';
import { isAuth } from '../controllers/authContoller.mjs';
import {
  createConversation,
  getAllConversations,
} from '../controllers/conversationController.mjs';

const router = Router();

router
  .route('/')
  .get(isAuth, getAllConversations)
  .post(isAuth, createConversation);

export default router;
