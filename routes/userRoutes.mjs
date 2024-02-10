import { Router } from 'express';
import {
  getAllUsers,
  searchUser,
  updatePassword,
  updateUser,
} from '../controllers/userController.mjs';
import { isAuth } from '../controllers/authContoller.mjs';

const router = Router();

router.get('/', isAuth, getAllUsers);
router.get('/:username', isAuth, searchUser);

router.route('/me').patch(isAuth, updateUser);
router.route('/updatePassword').patch(isAuth, updatePassword);

export default router;
