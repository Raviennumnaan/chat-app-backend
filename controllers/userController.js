import User from '../model/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { comparePassword } from '../utils/helpers.js';

export const getAllUsers = catchAsync(async function (req, res, next) {
  const users = await User.find();

  res.status(200).json({ status: 'success', data: { data: users } });
});

export const updateUser = catchAsync(async function (req, res, next) {
  const { password, ...updateObj } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updateObj, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ status: 'success', data: user });
});

export const updatePassword = catchAsync(async function (req, res, next) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !currentPassword)
    return next(
      new AppError('Please provide currentPassword and newPassword', 400)
    );

  const user = await User.findById(req.user.id).select('+password');

  if (!(await comparePassword(currentPassword, user.password)))
    return next(new AppError('Please provide correct current password', 401));

  user.password = newPassword;
  const updatedUser = await user.save();
  const { password, ...userObj } = updatedUser._doc;

  res.status(200).json({ status: 'success', data: userObj });
});

export const searchUser = catchAsync(async function (req, res, next) {
  const regexp = new RegExp('^' + req.params.username);

  const users = await User.find({
    username: regexp,
    _id: { $ne: req.user.id },
  });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});
