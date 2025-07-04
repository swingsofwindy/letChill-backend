const axios = require('axios')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//GET thong tin nghe si
const getSinger = async (req, res) => {
  const artistId = parseInt(req.params.id, 10);
  try {
    let singer = await prisma.ngheSi.findUnique({
      where: {
        MaNgheSi: artistId,
      }
    });

    if (!singer) {
      const response = await axios.get("https://api.jamendo.com/v3.0/artists", {
        params: {
          client_id: process.env.CLIENT_ID,
          format: 'json',
          id: artistId,
        },
      });

      const artist = response.data.results[0];
      if (!artist) {
        return res.status(404).json({ error: "SINGER_NOT_FOUND" });
      }

      singer = await prisma.ngheSi.create({
        data: {
          MaNgheSi: parseInt(artist.id, 10),
          TenNgheSi: artist.name,
          AvatarUrl: artist.image
        }
      });
    }

    const followers = await prisma.theoDoi.count({
      where: { MaNgheSi: artistId }
    });

    res.status(200).json({
      id: singer.MaNgheSi,
      name: singer.TenNgheSi,
      avatarUrl: singer.AvatarUrl,
      followers: followers
    });
  }
  catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

const getAllSingers = async (req, res) => {
  try {
    const singers = await prisma.ngheSi.findMany();

    const singersWithStats = await Promise.all(
      singers.map(async (singer) => {
        // Đếm số lượng bài hát của ca sĩ này
        const songCount = await prisma.baiHat.count({
          where: { MaNgheSi: singer.MaNgheSi }
        });
        // Đếm số lượng người theo dõi ca sĩ này
        const followers = await prisma.theoDoi.count({
          where: { MaNgheSi: singer.MaNgheSi }
        });
        return {
          id: singer.MaNgheSi,
          name: singer.TenNgheSi,
          avatarUrl: singer.AvatarUrl,
          songCount,
          followers
        };
      })
    );
    return res.status(200).json(singersWithStats);

    // Nếu chỉ trả về thông tin cơ bản:
    // const result = singers.map(singer => ({
    //   id: singer.MaNgheSi,
    //   name: singer.TenNgheSi,
    //   avatarUrl: singer.AvatarUrl,
    //   songCount: singer.baiHat.length,
    //   followersCount: singer.followers.length,
    // }));

    // res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

const createSinger = async (req, res) => {
  const { name, avatarUrl } = req.body;
  try {
    const createdSinger = await prisma.ngheSi.create({
      data: {
        TenNgheSi: name,
        AvatarUrl: avatarUrl
      }
    });

    res.status(201).json({
      id: createdSinger.MaNgheSi,
      name: createdSinger.TenNgheSi,
      avatarUrl: createdSinger.AvatarUrl,
      followers: 0
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

const updateSinger = async (req, res) => {
  const artistId = parseInt(req.params.id, 10);
  const { name, avatarUrl } = req.body;
  try {
    const existingSinger = await prisma.ngheSi.findUnique({
      where: { MaNgheSi: artistId }
    });

    if (!existingSinger) {
      return res.status(404).json({
        error: "SINGER_NOT_FOUND"
      });
    }

    const updatedSinger = await prisma.ngheSi.update({
      where: { MaNgheSi: artistId },
      data: {
        TenNgheSi: name,
        AvatarUrl: avatarUrl
      }
    });

    const followers = await prisma.theoDoi.count({
      where: { MaNgheSi: artistId }
    });

    res.status(200).json({
      id: updatedSinger.MaNgheSi,
      name: updatedSinger.TenNgheSi,
      avatarUrl: updatedSinger.AvatarUrl,
      followers: followers
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

const getSongsByArtist = async (req, res) => {
  const artistId = parseInt(req.params.singerId);

  try {
    const artist = await prisma.ngheSi.findUnique({
      where: { MaNgheSi: artistId },
    });
    const postgresSongs = await prisma.baiHat.findMany({
      where: {
        MaNgheSi: artistId,
      },
      select: {
        MaBaiHat: true,
        TenBaiHat: true,
        AvatarUrl: true,
        NgayDang: true,
      },
    });

    const formattedPostgresSongs = postgresSongs.map(song => ({
      id: song.MaBaiHat,
      name: song.TenBaiHat,
      avatarUrl: song.AvatarUrl,
      releaseDay: song.NgayDang,
    }));

    const jamendoArtist = await axios.get("https://api.jamendo.com/v3.0/artists", {
      params: {
        client_id: process.env.CLIENT_ID,
        format: "json",
        limit: 1,
        id: artistId,
      },
    })

    if (jamendoArtist.data.results[0] == 0)
      return res.status(201).json(
        formattedPostgresSongs
      );

    const jamendoResponse = await axios.get("https://api.jamendo.com/v3.0/tracks", {
      params: {
        client_id: "206f7c22",
        format: "json",
        limit: 20,
        order: "popularity_total",
        artist_id: artistId, // dùng tên ca sĩ để tìm
      },
    });

    const jamendoTracks = jamendoResponse.data.results.map(track => ({
      id: parseInt(track.id),
      name: track.name,
      avatarUrl: track.image,
      releaseDay: track.releasedate,
    }));

    console.log(jamendoTracks);
    console.log(formattedPostgresSongs)

    const allSongs = [...formattedPostgresSongs, ...jamendoTracks];

    // console.log("All songs:", allSongs);

    return res.status(200).json(
      {
        artist: {
          id: jamendoArtist.data.results[0].id,
          name: jamendoArtist.data.results[0].name,
          avatarUrl: jamendoArtist.data.results[0].image
        },
        songs: allSongs
      });

  } catch (error) {
    console.error("Error fetching songs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSinger = async (req, res) => {
  const artistId = parseInt(req.params.id, 10);
  try {
    const existingSinger = await prisma.ngheSi.findUnique({
      where: { MaNgheSi: artistId }
    });

    if (!existingSinger) {
      return res.status(404).json({
        error: "SINGER_NOT_FOUND"
      });
    }

    await prisma.ngheSi.delete({
      where: { MaNgheSi: artistId }
    });

    res.status(201).json();
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

// Kiểm tra đã follow chưa (GET /singer/:id/follows/:uid)
const checkFollowSinger = async (req, res) => {
  const singerId = parseInt(req.params.id, 10);
  const uid = req.params.uid;
  try {
    const follow = await prisma.theoDoi.findUnique({
      where: {
        MaNgheSi_MaNguoiDung: {
          MaNguoiDung: uid,
          MaNgheSi: singerId,
        },
      },
    });
    if (follow) {
      return res.status(200).json({ message: "ALREADY_FOLLOWED", isFollowing: true });
    }
    return res.status(200).json({ message: "NOT_FOLLOWED", isFollowing: false });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST /follows
const addFollowSinger = async (req, res) => {
  const uid = req.params.uid;
  const singerId = parseInt(req.params.id, 10);
  try {
    const follow = await prisma.theoDoi.findUnique({
      where: {
        MaNgheSi_MaNguoiDung: {
          MaNguoiDung: uid,
          MaNgheSi: singerId,
        },
      },
    });
    if (follow) {
      return res.status(201).json({ message: "ALREADY_FOLLOWED" });
    }
    await prisma.theoDoi.create({
      data: {
        MaNguoiDung: uid,
        MaNgheSi: singerId,
      },
    });
    res.status(201).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /follows
const removeFollowSinger = async (req, res) => {
  const singerId = parseInt(req.params.id, 10);
  const uid = req.params.uid;

  try {
    await prisma.theoDoi.delete({
      where: {
        MaNgheSi_MaNguoiDung: {
          MaNguoiDung: uid,
          MaNgheSi: singerId,
        },
      },
    });
    res.status(201).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /singer/followed/:uid
const getFollowedSingersByUser = async (req, res) => {
  const uid = req.params.uid;
  try {
    const follows = await prisma.theoDoi.findMany({
      where: { MaNguoiDung: uid },
      select: { MaNgheSi: true }
    });
    const singerIds = follows.map(f => f.MaNgheSi);
    const singers = await prisma.ngheSi.findMany({
      where: { MaNgheSi: { in: singerIds } }
    });
    const singersWithFollowers = await Promise.all(
      singers.map(async (singer) => {
        const followers = await prisma.theoDoi.count({
          where: { MaNgheSi: singer.MaNgheSi }
        });
        return {
          id: singer.MaNgheSi,
          name: singer.TenNgheSi,
          avatarUrl: singer.AvatarUrl,
          followers
        };
      })
    );
    res.status(200).json(singersWithFollowers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSinger,
  createSinger,
  updateSinger,
  deleteSinger,
  getSongsByArtist,
  addFollowSinger,
  removeFollowSinger,
  getAllSingers,
  checkFollowSinger,
  getFollowedSingersByUser,
};