class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404; // Set the HTTP status code
  }
}

module.exports = NotFoundError;
