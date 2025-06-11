const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { randomSongId } = require('../songData');

const getSongById = async (req, res) => {
  const songId = parseInt(req.params.id, 10);
  const uid = req.params.uid;
  try {
    const songRecord = await prisma.baiHat.findUnique({
      where: { MaBaiHat: songId },
      include: {
        NgheSi: true,
        NhacSi: true,
        TheLoai: true,
        TienDoNghe: {
          select: {
            TienDo: true,
          },
        }
      }
    });

    if (!songRecord) {
      const songJamendo = await axios.get("https://api.jamendo.com/v3.0/tracks", {
        params: {
          client_id: process.env.CLIENT_ID,
          format: 'json',
          limit: 1,
          id: songId,
        },
      });
      const song = songJamendo.data.results[0];
      if (!song) {
        return res.status(404).json({ message: "JAMEDO_SONG_NOT_FOUND" });
      }


      const jamendoArtist = await axios.get("https://api.jamendo.com/v3.0/artists", {
        params: {
          client_id: process.env.CLIENT_ID,
          format: "json",
          limit: 1,
          id: song.artist_id,
        },
      })

      if (!jamendoArtist.data.results) {
        return res.status(404).json({ message: "JAMEDO_ARTIST_NOT_FOUND" }); // <-- add return here
      }

      const artist = await prisma.ngheSi.upsert({
        where: { MaNgheSi: parseInt(jamendoArtist.data.results[0].id, 10) },
        update: {},
        create: {
          MaNgheSi: parseInt(jamendoArtist.data.results[0].id, 10),
          TenNgheSi: jamendoArtist.data.results[0].name,
          AvatarUrl: jamendoArtist.data.results[0].image,
        }
      });

      await prisma.nhacSi.upsert({
        where: { MaNhacSi: 1 },
        update: {},
        create: {
          MaNhacSi: 1,
          TenNhacSi: "Uploading Composer"
        }
      });

      await prisma.theLoai.upsert({
        where: { MaTheLoai: 1 },
        update: {},
        create: {
          MaTheLoai: 1,
          TenTheLoai: "Uploading Genre"
        }
      });

      const songResponse = await prisma.baiHat.create({
        data: {
          MaBaiHat: songId,
          TenBaiHat: song.name,
          MaNhacSi: 1,
          MaNgheSi: artist.MaNgheSi,
          MaTheLoai: 1,
          MaNguoiDang: "",
          BaiHatUrl: song.audio,
          DownloadUrl: song.audiodownload,
          AvatarUrl: song.image,
          NgayDang: new Date(song.releasedate),
          LuotNghe: 0,
          TienDo: song.duration,
        },
        include: {
          NgheSi: true,
          NhacSi: true,
          TheLoai: true
        }
      });

      return res.status(200).json({
        id: songResponse.MaBaiHat,
        name: songResponse.TenBaiHat,
        link: songResponse.BaiHatUrl,
        download: songResponse.DownloadUrl,
        avatarUrl: songResponse.AvatarUrl,
        releaseDate: songResponse.NgayDang,
        plays: songResponse.LuotNghe,
        lyric: songResponse.LoiBaiHat,
        duration: songResponse.TienDo,
        progress: songResponse.TienDoNghe?.find(p => p.MaNguoiDung === uid)?.TienDo || 0,
        composer: songResponse.NhacSi?.TenNhacSi,
        artist: songResponse.NgheSi?.TenNgheSi,
        genre: songResponse.TheLoai?.TenTheLoai,
      });
    }

    await prisma.baiHat.update({
      where: { MaBaiHat: songId },
      data: { LuotNghe: songRecord.LuotNghe + 1 }
    });
    console.log(songRecord.TienDoNghe);

    res.status(200).json({
      id: songRecord.MaBaiHat,
      name: songRecord.TenBaiHat,
      link: songRecord.BaiHatUrl,
      download: songRecord.DownloadUrl,
      avatarUrl: songRecord.AvatarUrl,
      releaseDate: songRecord.NgayDang,
      plays: songRecord.LuotNghe,
      lyric: songRecord.LoiBaiHat,
      duration: songRecord.TienDo,
      progress: songRecord.TienDoNghe[0]?.TienDo,
      composer: songRecord.NhacSi?.TenNhacSi,
      artist: songRecord.NgheSi?.TenNgheSi,
      genre: songRecord.TheLoai?.TenTheLoai,
    });


  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

const uploadSong = async (req, res) => {
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

const downloadSong = async (req, res) => {
  const songId = parseInt(req.params.id, 10);
  try {
    const song = await prisma.baiHat.findUnique({
      where: { MaBaiHat: songId },
      select: {
        DownloadUrl: true,
      }
    });
    if (!song) {
      const songRecord = await axios.get("https://api.jamendo.com/v3.0/tracks", {
        params: {
          client_id: process.env.CLIENT_ID,
          format: 'json',
          limit: 1,
          id: songId,
        }
      });
      const song = songRecord.data.results[0];
      if (!song) {
        return res.status(404).json({ message: "JAMEDO_SONG_NOT_FOUND" });
      }
      return res.status(200).json({
        link: song.audiodownload
      });
    }

    if (!song) {
      return res.status(404).json({
        error: "SONG_NOT_FOUND"
      });
    }

    res.status(200).json({
      link: song.DownloadUrl
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

const randomId = async (req, res) => {
  try {
    const randomId = await randomSongId();
    console.log(randomId);

    res.status(201).json({
      id: randomId
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// POST /tien-do
const updateSongProgress = async (req, res) => {
  const songId = parseInt(req.params.id, 10);
  const uid = req.params.uid;
  const progress = req.body.progress;

  try {
    await prisma.tienDoNghe.upsert({
      where: {
        MaNguoiDung_MaBaiHat: {
          MaNguoiDung: uid,
          MaBaiHat: songId,
        },
      },
      update: {
        TienDo: progress,
        ThoiGianCapNhat: new Date(),
      },
      create: {
        MaNguoiDung: uid,
        MaBaiHat: songId,
        TienDo: progress,
      },
    });
    res.json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /tien-do/:id/:songId
const getSongProgress = async (req, res) => {
  const { id, uid } = req.params;

  try {
    const progress = await prisma.tienDoNghe.findUnique({
      where: {
        MaNguoiDung_MaBaiHat: {
          MaNguoiDung: uid,
          MaBaiHat: parseInt(id, 10),
        },
      },
    });

    if (!progress) {
      return res.status(404).json({
        error: 'PROGRESS_NOT_EXIST',
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST /luot-nghe
const updateSongListenCount = async (req, res) => {
  const songId = parseInt(req.params.id, 10);

  try {
    await prisma.baiHat.update({
      where: { MaBaiHat: songId },
      data: {
        LuotNghe: {
          increment: 1,
        },
      },
    });

    res.status(201).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSongById,
  uploadSong,
  downloadSong,
  randomId,
  updateSongProgress,
  getSongProgress,
  updateSongListenCount
};
