const { db, admin } = require('../firebase')
const axios = require('axios');
const {RandomSongId}=require('../songData')
//
const getInformation = async (req, res) => {
  const songId = req.params.id;
  try {
    const response = await axios.get("https://api.jamendo.com/v3.0/tracks", {
      params: {
        client_id: process.env.CLIENT_ID,
        format: 'json',
        limit: 1, // Giới hạn số bài hát trả về
        id: songId,
      },
    });
    const song = response.data.results[0];
    // const firebaseDoc = await db.collection('song').doc(songId).get();
    // if (!firebaseDoc.exists) {
    //   await db.collection('song').doc(songId).set({
    //     name: song.name,
    //     tags: [],
    //     composer: "",
    //     lyric: [],
    //     play: 0,
    //   });
    // }
    const enhancedSong = {
      id: songId,
      name: song.name,
      artist: song.artist_name,
      audio: song.audio,
      image: song.image,
      releaseDate: song.releasedate,
      duration: song.duration,
      // genre: firebaseDoc.data().tags || [], // Lấy thể loại từ tags của Jamendo (nếu có)
      // composer: firebaseDoc.data().composer || "", // Giá trị mặc định là rỗng
      // lyric: firebaseDoc.data().lyric||[], // Giá trị mặc định là rỗng
      // play: firebaseDoc.data().play || 0, // Giá trị mặc định là 0 
      genre:  [], // Lấy thể loại từ tags của Jamendo (nếu có)
      composer: "", // Giá trị mặc định là rỗng
      lyric: [], // Giá trị mặc định là rỗng
      play: 0, // Giá trị mặc định là 0 
    }
    res.status(201).json(enhancedSong)

  } catch (error) {
    res.status(400).json({
      message: "Fail.",
      error: error.message
    })
  }
}

const getRandomSongId = async (req, res) => {
  console.log('randomSongId');
  try {
   const randomSongId= await RandomSongId();
   if(!randomSongId)
    res.status(404).json('Không tìm thấy.')
  else
  res.status(201).json({id:randomSongId});
  } catch (error) {
    console.error('Error fetching random song:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { getInformation, getRandomSongId };
