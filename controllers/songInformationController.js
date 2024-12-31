const {db, admin}=require('../firebase')
const axios=require('axios');
const { search } = require('../routes/lyricsRoute');
//
const getInformation=async(req,res)=>{
    const {songId}=req.body;
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
          const firebaseDoc = await db.collection('song').doc(songId).get();
          if (!firebaseDoc.exists) {
            await db.collection('song').doc(songId).set({
              name: song.name,
              tag:[],
              composer: "",
              lyric: [],
              play: 0,
            });
          }
          const enhancedSong ={
            id: songId,
            name: song.name,
            artist: song.artist_name,
            audio: song.audio,
            image: song.image,
            releaseDate: song.releasedate,
            genre: firebaseDoc.data.tags || [], // Lấy thể loại từ tags của Jamendo (nếu có)
            composer: firebaseDoc.data.composer || "", // Giá trị mặc định là rỗng
            lyric: firebaseDoc.data.lyric || [], // Giá trị mặc định là rỗng
            play: firebaseDoc.data.play || 0, // Giá trị mặc định là 0 
          }
          res.status(201).json(enhancedSong)

    } catch (error) {
        res.status(400).json({
            message:"Fail.",
            error: error.message
        })
    }
}

module.exports={
    getInformation
}