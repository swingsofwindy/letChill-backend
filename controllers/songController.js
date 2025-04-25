const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { randomSongId } = require('../songData')
//
const getSongById = async (req, res) => {
  // Giá trị cần thiết
  const songId = parseInt(req.params.id, 10);
  try {
    // Tìm bài hát trong DB trước
    let songRecord = await prisma.baiHat.findUnique({
      where: { MaBaiHat: songId },
      include: {
        NgheSi: true,
        NhacSi: true,
        TheLoai: true
      }
    });

    // Nếu không có thì fetch từ Jamendo
    if (!songRecord) {
      const response = await axios.get("https://api.jamendo.com/v3.0/tracks", {
        params: {
          client_id: process.env.CLIENT_ID,
          format: 'json',
          limit: 1,
          id: songId,
        },
      });

      const song = response.data.results[0];
      if (!song) {
        return res.status(404).json({ message: "Không tìm thấy bài hát trong Jamendo." });
      }

      await prisma.ngheSi.upsert({
        where: { MaNgheSi: parseInt(song.artist_id, 10) },
        update: {},
        create: {
          MaNgheSi: parseInt(song.artist_id, 10),
          TenNgheSi: song.artist_name,
          AvatarUrl: song.image,
        }
      });

      // Tạo bản ghi nhạc sĩ (nếu chưa có)
      await prisma.nhacSi.upsert({
        where: { MaNhacSi: 1 },
        update: {},
        create: {
          MaNhacSi: 1,
          TenNhacSi: "Uploading Composer"
        }
      });

      // Tạo bản ghi thể loại (nếu chưa có)
      await prisma.theLoai.upsert({
        where: { MaTheLoai: 1 },
        update: {},
        create: {
          MaTheLoai: 1,
          TenTheLoai: "Uploading Genre"
        }
      });

      // Lưu bài hát vào DB
      songRecord = await prisma.baiHat.create({
        data: {
          MaBaiHat: songId,
          TenBaiHat: song.name,
          MaNhacSi: 1,
          MaNgheSi: parseInt(song.artist_id, 10),
          MaTheLoai: 1,
          MaNguoiDang: '001',
          BaiHatUrl: song.audio,
          DownloadUrl: song.audiodownload,
          AvatarUrl: song.image,
          NgayDang: new Date(song.releasedate),
          LuotNghe: 0,
        },
        include: {
          NgheSi: true,
          NhacSi: true,
          TheLoai: true
        }
      });
    }

    // Chuẩn hóa dữ liệu trả về
    const enhancedSong = {
      id: songRecord.MaBaiHat,
      name: songRecord.TenBaiHat,
      link: songRecord.BaiHatUrl,
      download: songRecord.DownloadUrl,
      avatarUrl: songRecord.AvatarUrl,
      releaseDate: songRecord.NgayDang,
      plays: songRecord.LuotNghe,
      lyric: songRecord.LoiBaiHat,
      duration: songRecord.TienDo,
      composer: songRecord.NhacSi?.TenNhacSi,
      artist: songRecord.NgheSi?.TenNgheSi,
      genre: songRecord.TheLoai?.TenTheLoai,
    };

    res.status(200).json(enhancedSong);

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

const createSong = async (req, res) => {
  const { uid, name, link, download, avatarUrl, releaseDate, lyric, composer, artist, genre } = req.body;

  var artistInfo = await prisma.ngheSi.findFirst({
    where: { TenNgheSi: artist }
  });

  if (!artistInfo) {
    artistInfo = await prisma.ngheSi.create({
      data: {
        TenNgheSi: artist,
      }
    });
  }

  var composerInfo = await prisma.nhacSi.findFirst({
    where: { TenNhacSi: composer }
  })

  if (!composerInfo) {
    composerInfo = await prisma.nhacSi.create({
      data: {
        TenNhacSi: composer,
      }
    });
  }

  var genreInfo = await prisma.theLoai.findFirst({
    where: { TenTheLoai: genre }
  })

  if (!genreInfo) {
    genreInfo = await prisma.theLoai.create({
      data: {
        TenTheLoai: genre,
      }
    });
  }

  try {
    const createdSong = await prisma.baiHat.create({
      data: {
        TenBaiHat: name,
        BaiHatUrl: link,
        AvatarUrl: avatarUrl,
        NgayDang: new Date(releaseDate),
        LuotNghe: 0,
        LoiBaiHat: lyric,
        DownloadUrl: download,
        TienDo: 0,
        MaNguoiDang: uid,
        MaNgheSi: artistInfo.MaNgheSi,
        MaNhacSi: composerInfo.MaNhacSi,
        MaTheLoai: genreInfo.MaTheLoai,
      }
    });

    res.status(201).json({
      id: createdSong.MaBaiHat,
      name: createdSong.TenBaiHat,
      link: createdSong.BaiHatUrl,
      download: createdSong.DownloadUrl,
      avatarUrl: createdSong.AvatarUrl,
      releaseDate: createdSong.NgayDang,
      plays: createdSong.LuotNghe,
      lyric: createdSong.LoiBaiHat,
      duration: createdSong.TienDo,
      composer: createdSong.MaNhacSi,
      artist: createdSong.MaNgheSi,
      genre: createdSong.MaTheLoai
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

const getRandomSongId = async (req, res) => {
  try {
    const randomId = await randomSongId();

    res.status(201).json({
      id: randomId
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  getSongById,
  createSong,
  getRandomSongId
};
