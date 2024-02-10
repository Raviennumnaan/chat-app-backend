import { Router } from 'express';
import { isAuth } from '../controllers/authContoller.mjs';
import {
  createMessage,
  getConversationMessages,
} from '../controllers/messageController.mjs';

const router = Router();

router
  .route('/:id')
  .get(isAuth, getConversationMessages)
  .post(isAuth, createMessage);

export default router;
