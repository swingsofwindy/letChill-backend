const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createPayment = async (req, res) => {
  try {
    const { uid, amount, method } = req.body;
    const payment = await prisma.payment.create({
      data: {
        MaNguoiDung: userId,
        SoTien: amount,
        PhuongThuc: method,
        NgayTao: new Date().toISOString(),
      },
    });
    const user = await prisma.nguoiDung.findUnique({
      where: { MaNguoiDung: uid },
      select: {
        TenNguoiDung: true,
        AvatarUrl: true,
      },
    });

    res.status(201).json({
        id: payment.MaGiaoDich,
        user: {
            name: user.TenNguoiDung,
            avatarUrl: user.AvatarUrl,
        },
        amount: payment.SoTien,
        method: payment.PhuongThuc,
        createdAt: payment.NgayTao,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createPayment,
};