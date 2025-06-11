const axios = require('axios');
const { MeiliSearch } = require('meilisearch');

// Khởi tạo Meilisearch Client
const meiliClient = new MeiliSearch({ host: 'http://127.0.0.1:7700' });
const meiliIndex = meiliClient.index('songs');


async function searchInMeilisearch(query) {
  try {
    await meiliIndex.updateSearchableAttributes([
      'name',
      'artist',
      'lyric',
      'composer',
      'genre'
    ]);
    const searchResult = await meiliIndex.search(query, {
      matchingStrategy: 'all',
      limit: 10,
    });
    return searchResult.hits.length > 0 ? searchResult : null;
  } catch (error) {
    return [];
  }
}

async function searchInJamendo(query) {
  try {
    const response = await axios.get("https://api.jamendo.com/v3.0/tracks", {
      params: {
        client_id: process.env.CLIENT_ID,
        limit: 10,
        format: "json",
        name: query
      },
    });
    const songs = response.data.results;
    if (!songs) {
      return {
        songs: []
      };
    }

    const enhancedSongs = await Promise.all(
      songs.map(async (song) => {
        const songId = song.id;

        const enhancedSong = {
          id: songId,
          name: song.name,
          artist: song.artist_name,
          audio: song.audio,
          image: song.album_image,
          releaseDate: song.releasedate,
          genre: song.genre,
          duration: song.duration,
          composer: song.composer,
          lyric: [],
          play: 0,
        };

        return enhancedSong;
      })
    );
    await meiliIndex.addDocuments(enhancedSongs);
    return enhancedSongs;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function searchMeilisearch() {
  try {
    const index = meiliClient.index('songs');
    const hits = await index.search('', { limit: 5 });
    return hits;
  } catch (error) {
    return null;
  }
}

async function searchInPostgres(query, prisma) {
  const songs = await prisma.baiHat.findMany({
    where: {
      OR: [
        { NgheSi: { TenNgheSi: { contains: query, mode: "insensitive" } } },
        { NhacSi: { TenNhacSi: { contains: query, mode: "insensitive" } } },
        { TheLoai: { TenTheLoai: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      NgheSi: true,
      NhacSi: true,
      TheLoai: true,
    },
    take: 10,
  });

  const formatted = songs.map(song => ({
    id: song.MaBaiHat,
    name: song.TenBaiHat,
    artist: song.NgheSi?.TenNgheSi,
    composer: song.NhacSi?.TenNhacSi,
    genre: song.TheLoai?.TenTheLoai,
    avatarUrl: song.AvatarUrl,
    releaseDate: song.NgayDang,
    play: song.LuotNghe,
    lyric: song.LoiBaiHat || [],
  }));

  // Index vào Meili nếu muốn
  if (formatted.length > 0) {
    await meiliIndex.addDocuments(formatted);
  }

  return formatted;
}

async function deleteAllDocuments() {
  const index = meiliClient.index('songs');
  await index.deleteAllDocuments();
}

async function randomSongId() {
  try {
    const index = meiliClient.index('songs');

    const result = await index.getDocuments({ fields: ['id'], limit: 50 });

    if (result.results.length === 0) {
      console.log("no songs")
      return null;
    }

    const randomIndex = Math.floor(Math.random() * result.results.length);
    const randomSongId = result.results[randomIndex].id;

    return randomSongId;
  } catch (error) {
    console.log(error)
    return null;
  }
}


module.exports = {
  searchInMeilisearch,
  searchInJamendo,
  searchMeilisearch,
  searchInPostgres,
  deleteAllDocuments,
  randomSongId
}
