import passport from 'passport';
import { Strategy } from 'passport-local';
import User from '../model/userModel.mjs';
import AppError from '../utils/appError.mjs';
import { comparePassword } from '../utils/helpers.mjs';

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found', 400);

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new Strategy({ usernameField: 'email' }, async function (
    username,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: username }).select('+password');
      if (!user) throw new AppError('User not found', 400);

      if (!(await comparePassword(password, user.password)))
        throw new AppError('Passwords does not match', 401);

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  })
);
