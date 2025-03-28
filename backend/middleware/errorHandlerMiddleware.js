const DEFAULT_ERROR_STATUS_CODE = 500;
const DEFAULT_ERROR_MESSAGE = 'Something went wrong!';

function errorHandler(err, req, res, next) {
  message = err.message || DEFAULT_ERROR_MESSAGE;
  statusCode = err.statusCode || DEFAULT_ERROR_STATUS_CODE;

  if(statusCode == DEFAULT_ERROR_STATUS_CODE && process.env.APP_MODE === 'production') {
    message = DEFAULT_ERROR_MESSAGE;
  }

  res.status(statusCode).json({ message: message });
}

module.exports = errorHandler;

