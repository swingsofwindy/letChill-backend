const {db}=require('../firebase');
const axios=require('axios');
const {searchJamendo, searchMeilisearch}=require('../songData')
const JAMENDO_API_KEY = process.env.CLIENT_ID;

// Hàm lấy thông tin bài hát từ Jamendo
async function getSongFromJamendo() {
    try {
      const response = await searchMeilisearch();
      return response;
    } catch (error) {
      console.error('Error fetching song, error');
      return null;
    }
  }
  
  // Hàm lấy thông tin ca sĩ từ Jamendo
  async function getSingerFromJamendo(singerId) {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/artists', {
        params: {
          client_id: process.env.CLIENT_ID,
              format: 'json',
              limit: 1, // Giới hạn số nghệ sĩ trả về
              id: singerId,
        }
      });
  
      const artist = response.data.results[0];
      const artistInfo = {
        id: artist.id,
        name: artist.name || "Unknown Artist",
        image: artist.image || "",
        };
      return artistInfo;
    } catch (error) {
      console.error('Error fetching singer from Jamendo', error);
      return null;
    }
  }

const getDashboard= async (req,res)=>{
    try {
        const topSongs= await getSongFromJamendo();
        // Lấy top 10 ca sĩ có follower cao nhất
        const singerIds=[479140,543065,546016,439371, 7]
        const topSingers = [];

        for (const singerId of singerIds) {
          //console.log(doc.data.artistId)
          const jamendoData = await getSingerFromJamendo(singerId);
            topSingers.push(jamendoData);
        }
        // Trả về dữ liệu tổng hợp
        res.status(200).json({
            topSongs,
            topSingers,
        });
        
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports={
    getDashboard
}