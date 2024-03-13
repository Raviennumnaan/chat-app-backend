import { Router } from 'express';
import {
  authStatus,
  isAuth,
  login,
  signup,
} from '../controllers/authContoller.js';

const router = Router();

router.get('/status', isAuth, authStatus);

router.post('/signup', signup);
router.post('/login', login);

export default router;
