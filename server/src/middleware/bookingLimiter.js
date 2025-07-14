const rateLimit = require('express-rate-limit');

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each user to 3 booking requests per windowMs(3 is not a reasonable number, but it's used to test the limiter easier)
  message: {
    error: 'Too many booking requests from this user, please try again after 15 minutes.'
  },
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  skip: (req) => {
    return req.user && req.user.is_admin;
  }
});

module.exports = bookingLimiter;
