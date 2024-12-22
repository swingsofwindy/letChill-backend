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
            image: song.album_image,
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

const addSong = async (req, res) => {
    const { title, singerName, musicianName, genreName, songUrl, avatarUrl } = req.body;

    try {
        // Hàm kiểm tra và thêm mới nếu cần
        const getOrCreateDoc = async (collection, fieldName, value) => {
            // Tìm kiếm tài liệu dựa trên giá trị của trường
            const querySnapshot = await db.collection(collection).where(fieldName, "==", value).get();

            if (!querySnapshot.empty) {
                // Nếu tồn tại, trả về ID của tài liệu đầu tiên
                return querySnapshot.docs[0].id;
            } else {
                // Nếu không tồn tại, tạo mới
                const newDoc = await db.collection(collection).add({ [fieldName]: value, createdAt: new Date() });
                return newDoc.id; // Trả về ID của tài liệu mới
            }
        };

        // Xử lý từng thực thể
        const singerId = await getOrCreateDoc('singer', 'name', singerName);
        const musicianId = await getOrCreateDoc('musician', 'name', musicianName);
        const genreId = await getOrCreateDoc('song_genre', 'name', genreName);

        // Tạo bài hát mới
        const newSong = {
            title: title,
            singerId: singerId,
            musicianId: musicianId,
            genreId: genreId,
            songUrl: songUrl,
            avatarUrl: avatarUrl,
            createdAt: new Date(),
            views:0
        };

        const songRef = await db.collection('song').add(newSong);

        res.status(201).json({
            message: "Song added successfully.",
            songId: songRef.id,
            song: newSong,
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add song.",
            error: error.message
        });
    }
};

module.exports={
    getInformation,
    addSong
}