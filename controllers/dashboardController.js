const {db}=require('../firebase');
const axios=require('axios');
const {searchJamendo, searchMeilisearch}=require('../songData')
const JAMENDO_API_KEY = process.env.CLIENT_ID;

// Hàm lấy thông tin bài hát từ Jamendo
async function getSongFromJamendo(songId) {
    try {
      const meiliResult = await searchMeilisearch(songId);
      if (meiliResult) {
        return meiliResult; // Trả về kết quả tìm kiếm từ Meilisearch
      }

      const jamendoResult = await searchJamendo(songId);
      if (jamendoResult) {    
        return jamendoResult;// Trả về bài hát từ Jamendo
      }
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
          client_id: process.env.CLIENT_ID,
              format: 'json',
              limit: 1, // Giới hạn số nghệ sĩ trả về
              id: singerId,
        }
      });
  
      const artist = response.data.results[0];
      const artistDoc = await db.collection("singers").doc(singerId).get();
      const artistInfo = {
        id: artist.id,
        name: artist.name || "Unknown Artist",
        image: artist.image || "",
        website: artist.website || "",
        shorturl: artist.shorturl || "",
        proImage: artist.pro_image || "",
        musicLinks: artist.musiclinks || [],
        followers: artistDoc.data().followers, // Số người theo dõi từ Firebase
        };
      return artistInfo;
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
            const jamendoData = await getSongFromJamendo(doc.data.songId);
            topSongs.push(jamendoData);
        }
        // Lấy top 10 ca sĩ có follower cao nhất
        const singersQuery = await db.collection('singers').orderBy('followers', 'desc').limit(10).get();
        const topSingers = [];

        for (const doc of singersQuery.docs) {
          //console.log(doc.data.artistId)
          const jamendoData = await getSingerFromJamendo(doc.id);
            topSingers.push(jamendoData);
        }

            // Lấy các playlist theo thứ tự được nghe từ gần tới xa
        const playlistsQuery = await db.collection('playlist').get();
        const playlists = [];
        playlistsQuery.forEach(doc => {
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