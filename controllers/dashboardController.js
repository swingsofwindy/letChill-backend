const {db}=require('../firebase');
const JAMENDO_API_KEY = process.env.CLIENT_ID;

// Hàm lấy thông tin bài hát từ Jamendo
async function getSongFromJamendo(songId) {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/tracks`, {
        params: {
          client_id: JAMENDO_API_KEY,
          id: songId
        }
      });
  
      const data = response.data.results;
      return data.length ? data[0] : null;
    } catch (error) {
      console.error(`Error fetching song from Jamendo (ID: ${songId}):`, error);
      return null;
    }
  }
  
  // Hàm lấy thông tin ca sĩ từ Jamendo
  async function getSingerFromJamendo(singerId) {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/artists`, {
        params: {
          client_id: JAMENDO_API_KEY,
          id: singerId
        }
      });
  
      const data = response.data.results;
      return data.length ? data[0] : null;
    } catch (error) {
      console.error(`Error fetching singer from Jamendo (ID: ${singerId}):`, error);
      return null;
    }
  }

const getDashboard= async (req,res)=>{
    try {
        const songsQuery=await db.collection('song').orderBy('play','desc').limit(6).get();
        const topSongs=[];
        for (const doc of songsQuery.docs) {
            const songData = doc.data();
            const jamendoData = await getSongFromJamendo(songData.songId);
            topSongs.push({
                id: doc.id,
                ...songData,
                dataInJamendo: jamendoData
            });
        }
        // Lấy top 10 ca sĩ có follower cao nhất
        const singersQuery = await db.collection('singers').orderBy('follower', 'desc').limit(10).get();
        const topSingers = [];
        for (const doc of singersQuery.docs) {
            const singerData = doc.data();
            const jamendoData = await getSingerFromJamendo(singerData.singerId);
            topSingers.push({
                id: doc.id,
                ...singerData,
                dataInJamendo: jamendoData
            });
        }

            // Lấy các playlist theo thứ tự được nghe từ gần tới xa
        const playlistsQuery = db.collection('playlists').orderBy('lastPlayed', 'desc');
        const playlistsSnapshot = await playlistsQuery.get();
        const playlists = [];
        playlistsSnapshot.forEach(doc => {
        playlists.push({ id: doc.id, ...doc.data() });
        });

        // Trả về dữ liệu tổng hợp
        res.status(200).json({
            topSongs,
            topSingers,
            playlists
        });
        
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports={
    getDashboard
}