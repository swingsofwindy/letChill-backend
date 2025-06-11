const { PrismaClient } = require('@prisma/client');
const { error } = require('firebase-functions/logger');
const prisma = new PrismaClient();

//GET profile
const getProfile = async (req, res) => {
  const uid = req.params.id;
  try {
    // Lấy thông tin người dùng và danh sách phát liên quan
    const user = await prisma.user.findUnique({
      where: { MaNguoiDung: uid },
      include: {
        DanhSachPhat: {
          select: {
            MaDanhSach: true,
            TenDanhSach: true,
            AvatarUrl: true,
          }
        },
        DangKy: {
          select: {
            MaDangKy: true,
            Goi: true,
            PhuongThuc: true,
            NgayBatDau: true,
            NgayKetThuc: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND"
      });
    }

    const playlistCount = user.DanhSachPhat.length;
    res.status(200).json({
      id: user.MaNguoiDung,
      name: user.TenNguoiDung,
      avatarUrl: user.AvatarUrl,
      role: user.Role,
      playlist: user.DanhSachPhat.map(p => ({
        id: p.MaDanhSach,
        name: p.TenDanhSach,
        avatarUrl: p.AvatarUrl
      })),
      playlistCount: playlistCount,
      subscription: user.DangKy.map(s => ({
        id: s.MaDangKy,
        type: s.Goi,
        method: s.PhuongThuc,
        startDate: s.NgayBatDau,
        endDate: s.NgayKetThuc
      }))
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//UPDATE profile
const updateProfile = async (req, res) => {
  const uid = req.params.id;
  const { name, avatarUrl } = req.body;
  try {
    await prisma.user.update({
      where: { MaNguoiDung: uid },
      data: {
        TenNguoiDung: name,
        AvatarUrl: avatarUrl
      }
    });

    res.status(200).json();

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getProfile,
  updateProfile
}