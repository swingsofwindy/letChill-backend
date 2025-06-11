const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'TOKEN_NOT_FOUND' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email, // nếu cần
    };

    next();
  } catch (err) {
    console.error('verifyToken error:', err);
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
};

module.exports = verifyToken;