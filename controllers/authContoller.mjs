import User from '../model/userModel.mjs';
import AppError from '../utils/appError.mjs';
import catchAsync from '../utils/catchAsync.mjs';

export const signup = catchAsync(async function (req, res, next) {
  const user = await User.create(req.body);
  const { password, ...userObj } = user._doc;

  req.login(user, err => {
    if (err) {
      return next(err);
    }

    return res.status(201).json({ status: 'success', data: { data: userObj } });
  });
});

export const login = function (req, res) {
  const { password, ...user } = req.user._doc;
  res.status(200).json({ status: 'success', data: user });
};

export const logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);

    res.status(200).json({ status: 'success' });
  });
};

export const isAuth = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  else next(new AppError('User not authorized', 401));
};

export const authStatus = function (req, res, next) {
  if (!req.user) return next(new AppError('User not Logged in', 401));

  res.status(200).json({ status: 'success', data: req.user });
};
