import { Router } from 'express';
import {
  getAllUsers,
  searchUser,
  updatePassword,
  updateUser,
} from '../controllers/userController.js';
import { isAuth } from '../controllers/authContoller.js';

const router = Router();

router.get('/', isAuth, getAllUsers);
router.get('/:username', isAuth, searchUser);

router.route('/me').patch(isAuth, updateUser);
router.route('/updatePassword').patch(isAuth, updatePassword);

export default router;
