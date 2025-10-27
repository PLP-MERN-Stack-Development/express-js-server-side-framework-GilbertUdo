// Simple API key authentication
const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === '12345') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid or missing API key' });
  }
};

module.exports = auth;
