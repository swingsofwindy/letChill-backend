const {db, admin}=require('../firebase')
const axios=require('axios');

//
const getPlaylistDetail=async (req,res)=>{
  const playlistId=req.params.id;
  try {
        // Lấy thông tin danh sách phát từ Firebase
        const playlistDoc = await db.collection('playlist').doc(playlistId).get();
    
        if (!playlistDoc.exists) {
          return res.status(404).json({ message: 'Playlist not found' });
        }
        
        const playlistData = playlistDoc.data();
        const songIds = playlistData.songIds || []; // Danh sách songId từ playlist
    
        // Lấy thông tin bài hát từ cả Jamendo và Firebase
        const songDetails = await Promise.all(
          songIds.map(async (songId) => {
            try {
              // Truy vấn Jamendo API
              const jamendoResponse = await axios.get('https://api.jamendo.com/v3.0/tracks', {
                params: {
                  client_id: process.env.CLIENT_ID, // Đảm bảo đã cấu hình CLIENT_ID trong biến môi trường
                  format: 'json',
                  id: songId,
                },
              });
    
              const song = jamendoResponse.data.results[0]; // Kết quả từ Jamendo
    
              // Truy vấn Firebase
              const firebaseDoc = await db.collection('song').doc(songId).get();
              const firebaseData = firebaseDoc.exists ? firebaseDoc.data() : {};
    
              // Kết hợp thông tin từ cả Jamendo và Firebase
              return {
                id: songId,
                name: song?.name || '',
                artist: song?.artist_name || '',
                audio: song?.audio || '',
                image: song?.album_image || '',
                releaseDate: song?.releasedate || '',
                genre: song?.tags || [],
                composer: firebaseData?.composer || '', // Giá trị mặc định nếu không có
                lyric: firebaseData?.lyric || '', // Giá trị mặc định nếu không có
                play: firebaseData?.play || 0, // Giá trị mặc định nếu không có
              };
            } catch (error) {
              console.error(`Error fetching details for songId: ${songId}`, error);
              return null; // Trả về null nếu có lỗi
            }
          })
        );
    
        // Lọc bỏ các bài hát null (nếu lỗi khi lấy dữ liệu)
        const validSongs = songDetails.filter((song) => song !== null);
    
        // Trả về thông tin danh sách phát
        const responseData = {
          playlistId,
          name: playlistData.name || 'Unknown Playlist',
          description: playlistData.description || '',
          songs: validSongs, // Danh sách bài hát
        };
        await db.collection('playlist').doc(playlistId).update({
          lastPlayed: admin.firestore.FieldValue.serverTimestamp()
      });
        res.status(200).json(responseData);
      } catch (error) {
        console.error('Error fetching playlist details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
}

//
const addSongToPlaylist= async (req, res)=>{
  const playlistId=req.params.id;
  const {songId}=req.body;
    try {
        await db.collection('playlist').doc(playlistId).update({
            songIds: admin.firestore.FieldValue.arrayUnion(songId)
        });
        res.status(201).json({
            message: "Success."
        });
    } catch (error) {
        res.status(400).json({
            message:"Fail.",
            error:error.message
        })
    }
}

const deleteSongFromPlaylist= async (req, res)=>{
  const playlistId=req.params.id;
  const {songId}=req.body;
    
    try {
        await db.collection('playlist').doc(playlistId).update({
            songIds: admin.firestore.FieldValue.arrayRemove(songId)
        });
        res.status(201).json({message: "Success."});
    } catch (error) {
        res.status(400).json({
            message:"Fail.",
            error: error.message
        })
    }
}

module.exports={
    getPlaylistDetail, 
    addSongToPlaylist, 
    deleteSongFromPlaylist
}