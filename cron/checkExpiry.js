const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function checkExpiry() {
  const now = new Date();
  const expired = await prisma.subscription.findMany({
    where: { endDate: { lt: now } },
  });

  for (const sub of expired) {
    await prisma.user.update({
      where: { MaNguoiDung: sub.userId },
      data: { Role: 'USER' },
    });
    await prisma.subscription.delete({ where: { id: sub.id } });
  }
};
