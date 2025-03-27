const DEFAULT_ERROR_STATUS_CODE = 500;
const DEFAULT_ERROR_MESSAGE = 'Something went wrong!';

function errorHandler(err, req, res, next) {
  if(err.name == 'NotFoundError') {
    return res.status(404).json({ message: err.message });
  }
  
  message = err.message || DEFAULT_ERROR_MESSAGE;
  if(process.env.APP_MODE === 'production') {
    message = DEFAULT_ERROR_MESSAGE;
  }

  res.status(err.statusCode || DEFAULT_ERROR_STATUS_CODE).json({ message: message });
}

module.exports = errorHandler;

