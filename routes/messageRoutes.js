import { Router } from 'express';
import { isAuth } from '../controllers/authContoller.js';
import {
  createMessage,
  getConversationMessages,
} from '../controllers/messageController.js';

const router = Router();

router
  .route('/:id')
  .get(isAuth, getConversationMessages)
  .post(isAuth, createMessage);

export default router;
