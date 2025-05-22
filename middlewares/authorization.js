const { getAuth } = require('firebase-admin/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const uid = req.user.uid;

      if (!uid) {
        return res.status(401).json({ error: 'UNAUTHORIZED' });
      }

      const user = await prisma.user.findUnique({
        where: { MaNguoiDung: uid },
        select: {
          Role: true
        }
      });

      if (!user || !allowedRoles.includes(user.Role)) {
        return res.status(403).json({ error: 'MISSING_REQUIRED_ROLE' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'INVALID_TOKEN' });
    }
  };
};

module.exports = authorize;
