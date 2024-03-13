import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { hashPassword } from '../utils/helpers.js';
import { MULTIAVATAR_API_URL } from '../utils/constants.js';

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    minLength: [4, 'Username must be 3 or more characters'],
    maxLength: [20, 'Username must be 20 or less characters'],
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password should be atleast 8 characters'],
    select: false,
  },

  avatarImage: { type: String, default: '' },
});

userSchema.pre('save', function (next) {
  if (!this.isNew) return next();
  this.avatarImage = `${MULTIAVATAR_API_URL}/${this.username}.png`;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await hashPassword(this.password);

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
