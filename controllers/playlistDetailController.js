const { PrismaClient } = require('@prisma/client');
const e = require('cors');
const { error } = require('firebase-functions/logger');
const prisma = new PrismaClient();

//
const getPlaylistDetail = async (req, res) => {
  const playlistId = parseInt(req.params.id, 10);
  try {
    const playlistById = await prisma.danhSachPhat.findUnique({
      where: { MaDanhSach: playlistId },
      include: {
        CTDanhSachPhat: {
          include: {
            BaiHat: {
              include: {
                NhacSi: true,
                NgheSi: true,
                TheLoai: true
              }
            }
          }
        }
      }
    });

    if (!playlistById) {
      return res.status(404).json({
        error: 'PLAYLIST_NOT_FOUND',
      });
    }

    const songDetails = playlistById.CTDanhSachPhat.map(item => {
      const song = item.BaiHat;
      return {
        id: song.MaBaiHat,
        name: song.TenBaiHat,
        artist: song.NgheSi?.TenNgheSi,
        audio: song.BaiHatUrl,
        avatarUrl: song.AvatarUrl,
        releaseDate: song.NgayDang,
        genre: song.TheLoai?.TenTheLoai,
        composer: song.NhacSi?.TenNhacSi,
        lyric: song.LoiBaiHat,
        plays: song.LuotNghe,
        duration: song.TienDo,
        download: song.DownloadUrl
      };
    });

    res.status(200).json({
      id: playlistById.MaDanhSach,
      name: playlistById.TenDanhSach,
      avatarUrl: playlistById.AvatarUrl,
      createdAt: playlistById.NgayDang,
      songsCount: songDetails.length,
      songs: songDetails
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

const addSongToPlaylist = async (req, res) => {
  const playlistId = parseInt(req.params.id, 10);
  const uid = req.user.id;
  const songId = req.query.songId;

  try {
    const playlist = await prisma.danhSachPhat.findUnique({
      where: { 
        MaDanhSach: playlistId,
        MaNguoiDung: uid
      }
    });

    if (!playlist) {
      return res.status(404).json({
        error: 'PLAYLIST_NOT_FOUND'
      });
    }

    const song = await prisma.baiHat.findUnique({
      where: { MaBaiHat: songId }
    });

    if (!song) {
      return res.status(404).json({
        error: 'SONG_NOT_FOUND'
      });
    }

    // Kiểm tra nếu bài hát đã tồn tại trong playlist
    const existed = await prisma.cT_DanhSachPhat.findUnique({
      where: {
        MaDanhSach_MaBaiHat: {
          MaDanhSach: playlistId,
          MaBaiHat: songId
        }
      }
    });

    if (existed) {
      return res.status(400).json({ message: 'SONG_ALREADY_IN_PLAYLIST' });
    }

    // Thêm bài hát vào playlist
    await prisma.cT_DanhSachPhat.create({
      data: {
        MaDanhSach: playlistId,
        MaBaiHat: songId,
        NgayThem: new Date()
      }
    });

    res.status(201).json();

    console.log({ playlistId, songId });
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

const deleteSongFromPlaylist = async (req, res) => {
  const playlistId = parseInt(req.params.id, 10);
  const uid = req.user.id;
  const songId = req.query.songId;

  try {
    const playlist = await prisma.danhSachPhat.findUnique({
      where: { 
        MaDanhSach: playlistId,
        MaNguoiDung: uid
      }
    });

    if (!playlist) {
      return res.status(404).json({
        error: 'PLAYLIST_NOT_FOUND'
      });
    }

    const song = await prisma.baiHat.findUnique({
      where: { MaBaiHat: songId }
    });

    if (!song) {
      return res.status(404).json({
        error: 'SONG_NOT_FOUND'
      });
    }

    const songOfPlaylistToDelete = await prisma.cT_DanhSachPhat.findUnique({
      where: {
        MaDanhSach_MaBaiHat: {
          MaDanhSach: playlistId,
          MaBaiHat: songId
        }
      }
    });

    if (!songOfPlaylistToDelete) {
      return res.status(400).json({
        error: 'SONG_NOT_IN_PLAYLIST'
      });
    }

    await prisma.cT_DanhSachPhat.delete({
      where: {
        MaDanhSach_MaBaiHat: {
          MaDanhSach: playlistId,
          MaBaiHat: songId
        }
      }
    });

    res.status(201).json();

    console.log({ playlistId, songId });
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

module.exports = {
  getPlaylistDetail,
  addSongToPlaylist,
  deleteSongFromPlaylist
}