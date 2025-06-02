const axios=require('axios');
const {searchMeilisearch}=require('../songData')
const JAMENDO_CLIENT_ID = process.env.CLIENT_ID;

  const getSongDetails = async (songId) => {
  try {
    const res = await axios.get('https://api.jamendo.com/v3.0/tracks', {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        id: songId,
      },
    });
    return res.data.results[0].image|| null;
  } catch {
    return null;
  }
};

const getArtistAvatar = async (artistId) => {
  try {
    const res = await axios.get('https://api.jamendo.com/v3.0/artists', {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        id: artistId,
      },
    });
    return res.data.results[0].image || null;
  } catch {
    return null;
  }
};

const getDashboard= async (req,res)=>{
  const user_id  = parseInt(req.query.user_id,10); 
  const top_n = parseInt(req.query.top_n,10); 
  try {       
      const songsRecommentation = await axios.get('http://127.0.0.1:8000/recommendations', {
        params: {
          user_id: user_id, 
          top_n: top_n
        },
      });

      const artistsRecommentation = await axios.get('http://127.0.0.1:8000/popular-artists', {
        params: {
          user_id: user_id, 
          top_n: top_n
        },
      });

      const songsByRateRecommentation = await axios.get('http://127.0.0.1:8000/top-rated-songs', {
        params: {
          user_id: user_id, 
          top_n: top_n
        },
      });

      // const singerIds=[479140,543065,546016,439371, 7]
      // const singersRecommentation = [];

      // for (const singerId of singerIds) {
      //   const jamendoData = await getSingerFromJamendo(singerId);
      //   singersRecommentation.push(jamendoData);
      // }

    const songs = songsRecommentation.data;
    const artists = artistsRecommentation.data;
    const ratedSongs = songsByRateRecommentation.data;

    const songsWithAvatars = await Promise.all(
      songs.map(async (song) => ({
        ...song,
        avatar_url: await getSongDetails(song.song_id),
        artist_avatar_url: await getArtistAvatar(song.artist_id),
      }))
    );

    const singersWithAvatars = await Promise.all(
      artists.map(async (artist) => ({
        ...artist,
        artist_avatar_url: await getArtistAvatar(artist.artist_id),
      }))
    );

    const ratedSongsWithAvatars = await Promise.all(
      ratedSongs.map(async (song) => ({
        ...song,
        avatar_url: await getSongDetails(song.song_id),
        artist_avatar_url: await getArtistAvatar(song.artist_id || null),
      }))
    );

    res.status(200).json({
      songsRecommentation: songsWithAvatars,
      singersRecommentation: singersWithAvatars,
      songsByRateRecommentation: ratedSongsWithAvatars,
    });        
    } catch (error) {
        res.status(500).json({ 
          error: error.message 
        });
    }
}

module.exports={
    getDashboard
}