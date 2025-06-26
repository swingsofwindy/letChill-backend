const { PrismaClient } = require('@prisma/client');
const { error } = require('firebase-functions/logger');
const { select } = require('firebase-functions/params');
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
      }
    });

    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND"
      });
    }

    const songs = await prisma.baiHat.findMany({
      where: {
        MaNguoiDang: uid,
      },
      select: {
        MaBaiHat: true,
        TenBaiHat: true,
        NgheSi: {
          select: {
            MaNgheSi: true,
            TenNgheSi: true,
          }
        },
        AvatarUrl: true,
        NgayDang: true,
      }
    })

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

      song: songs.map(s => ({
        id: s.MaBaiHat,
        name: s.TenBaiHat,
        avatarUrl: s.AvatarUrl,
        artistId: s.NgheSi.MaNgheSi,
        artistName: s.NgheSi.TenNgheSi,
        releaseDay: s.NgayDang,
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