import jwtPkg from 'jsonwebtoken';
import User from '../model/userModel.js';
import { promisify } from 'util';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { comparePassword } from '../utils/helpers.js';

const { sign, verify } = jwtPkg;

function signToken(id) {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export const signup = catchAsync(async function (req, res, next) {
  const user = await User.create(req.body);
  const { password, ...userObj } = user._doc;

  const token = signToken(user.id);

  return res.status(201).json({ status: 'success', data: userObj, token });
});

export const login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provid email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('User not found', 404));

  if (!(await comparePassword(password, user.password)))
    return next(new AppError('Password does not match', 401));

  const token = signToken(user.id);

  res.status(200).json({ status: 'success', data: user, token });
});

export const isAuth = catchAsync(async function (req, res, next) {
  let token;
  // 1) Check token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ').at(1);

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );

  // 2) Validate token
  const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

  // 3) Get user
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('User not found', 404));

  // 4) Attach user with req
  req.user = user;

  next();
});

export const authStatus = function (req, res, next) {
  if (!req.user) return next(new AppError('User not Logged in', 401));

  res.status(200).json({ status: 'success', data: req.user });
};
