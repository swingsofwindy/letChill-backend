const { searchInMeilisearch, searchInJamendo } = require('../songData');

const getListSongs = async (req, res) => {
  const query = req.query.query;
  try {
    const meiliResult = await searchInMeilisearch(query);

    if (meiliResult) {
      const hits = meiliResult.hits.map((hit) => ({
        id: hit.id,
        name: hit.name,
        artist: hit.artist,
        avatarUrl: hit.image,
        link: hit.audio,
        lyric: hit.lyric,
        releaseDate: hit.releaseDate,
        genre: hit.genre,
        composer: hit.composer,
        play: hit.play
      }))
      return res.status(200).json(
        hits
      ); // Trả về kết quả tìm kiếm từ Meilisearch
    }
    const jamendoResult = await searchInJamendo(query);

    if (jamendoResult) {
      const hits = jamendoResult.map((song) => ({
        id: song.id,
        name: song.name,
        artist: song.artist,
        avatarUrl: song.image,
        link: song.audio,
        lyric: song.lyric,
        releaseDate: song.releaseDate,
        genre: song.genre,
        composer: song.composer,
        play: song.play
      }))

      return res.status(200).json(
        hits
      );
    }

    return res.status(404).json({
      error: 'SONG_NOT_FOUND'
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

module.exports = getListSongs;