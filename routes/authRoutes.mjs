import { Router } from 'express';
import {
  authStatus,
  login,
  logout,
  signup,
} from '../controllers/authContoller.mjs';
import passport from 'passport';

const router = Router();

router.get('/status', authStatus);

router.post('/signup', signup);
router.post('/login', passport.authenticate('local'), login);
router.get('/logout', logout);

export default router;
