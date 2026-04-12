const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

//added this middleware to handle async errors in our controllers. Instead of wrapping each controller function in a try-catch block, we can simply use this asyncHandler to catch any errors that occur in the async functions and pass them to the next() function, which will then be handled by our global error handler in app.js. This helps to keep our controller code clean and focused on the business logic, while still ensuring that any errors are properly handled and returned to the client.
