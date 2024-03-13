import AppError from '../utils/appError.js';

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const keys = Object.keys(err.keyValue);
  const values = Object.values(err.keyValue);

  const message = keys.reduce(
    (acc, key, i) => acc + ` ${key}: ${values[i]} already exists, `,
    ''
  );

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiry = () =>
  new AppError('Token expired. Please log in again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  if (!err.isOperational) {
    console.log('Error ❌❌❌', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err,
    });
  }

  res.status(err.statusCode).json({ status: err.status, message: err.message });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let newError = JSON.parse(JSON.stringify(err));

    if (newError.name === 'CastError') newError = handleCastErrorDB(newError);

    if (newError.code === 11000) newError = handleDuplicateFieldsDB(newError);

    if (newError.name === 'ValidationError')
      newError = handleValidationErrorDB(newError);

    if (newError.name === 'JsonWebTokenError') newError = handleJWTError();
    if (newError.name === 'TokenExpiredError') newError = handleJWTExpiry();

    sendErrorProduction(newError, res);
  }
};
