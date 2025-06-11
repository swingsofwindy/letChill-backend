const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const { uid } = req.user;

      if (!uid) {
        return res.status(401).json({ error: 'UNAUTHORIZED' });
      }

      const user = await prisma.user.findUnique({
        where: { MaNguoiDung: uid },
        select: {
          MaNguoiDung: true,
          Role: true
        }
      });

      if (!user || !allowedRoles.includes(user.Role)) {
        return res.status(403).json({ error: 'MISSING_REQUIRED_ROLE' });
      }

      req.user = { ...req.user, role: user.Role, uid: user.MaNguoiDung }; // giữ nguyên uid và role
      next();
    } catch (err) {
      console.error('authorize error:', err);
      return res.status(401).json({ error: 'INVALID_TOKEN' });
    }
  };
};

module.exports = authorize;