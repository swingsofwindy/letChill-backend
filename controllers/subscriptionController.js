const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const upgradeSubscription = async (req, res) => {
  const { type, method } = req.body;
  const uid = req.params.id;

  const user = await prisma.user.findUnique({
    where: { MaNguoiDung: uid },
  });

  const now = new Date();
  const durations = {
    WEEKLY: 7,
    MONTHLY: 30,
    STUDENT: 90
  };

  const endDate = new Date(now.getTime() + durations[type] * 24 * 60 * 60 * 1000);

  try {
    await prisma.dangKy.create({
      data: {
        MaNguoiDung: user.MaNguoiDung,
        Goi: type,
        PhuongThuc: method,
        NgayBatDau: now,
        NgayKetThuc: endDate
      }
    });

    await prisma.user.update({
      where: { MaNguoiDung: user.MaNguoiDung },
      data: { Role: 'CREATOR' },
    });

    res.json();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await prisma.dangKy.findFirst({
      where: {
        MaNguoiDung: req.user.MaNguoiDung,
        NgayBatDau: {
          lte: new Date(),
        },
        NgayKetThuc: {
          gte: new Date(),
        },
      }
    });

    if (!subscription) return res.json({ status: 'SUBSCRIPTION_NOT_FOUND' });

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
    upgradeSubscription, 
    getSubscriptionStatus 
};
