const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendMail } = require('../utils/mailer');

module.exports = async function notifyExpiry() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  const subs = await prisma.subscription.findMany({
    where: {
      endDate: { gte: start, lte: end },
    },
    include: { user: true },
  });

  const subsType = '';

  switch (subs.type) {
    case 'WEEKLY':
      subsType = 'Premium Mini';
      break;
    case 'MONTHLY':
      subsType = 'Premium Individual';
      break;
    case 'STUDENT':
      subsType = 'Premium Student';
      break;
  }

  for (const sub of subs) {
    await sendMail({
      from: `"Letchill - No Reply" <${process.env.WEB_MAIL}>`,
      to: sub.user.Email,
      subject: '🔔 Gói đăng ký của bạn sắp hết hạn',
      html: `
        <h3>Xin chào ${sub.user.TenNguoiDung},</h3>
        <p>Gói <strong>${subsType}</strong> mà bạn đã đăng ký sẽ hết hạn vào ngày <strong>${sub.NgayKetThuc.toLocaleDateString()}</strong>.</p>
        <p>Hãy gia hạn để tiếp tục tải và đăng nhạc trên Letchill!</p>
        <br><p>Letchill Team 🎵</p>
      `,
    });
  }
};
