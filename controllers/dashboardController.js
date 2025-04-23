const axios=require('axios');
const {searchMeilisearch}=require('../songData')

async function getSongFromMelisearch() {
  try {
      const response = await searchMeilisearch();
      return {
          hits: response.hits.map((hit) => ({
              id: hit.id,
              name: hit.name,
              avatarUrl: hit.image,
              releaseDate: hit.releaseDate,
              play: hit.play
          })),
      };
    } catch (error) {
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
        name: artist.name,
        avatarUrl: artist.image,
        };
      return artistInfo;
    } catch (error) {
      return null;
    }
  }

const getDashboard= async (req,res)=>{
    try {
        const topSongs= await getSongFromMelisearch();

        // Lấy top 10 ca sĩ có follower cao nhất
        const singerIds=[479140,543065,546016,439371, 7]
        const topSingers = [];

        for (const singerId of singerIds) {
          const jamendoData = await getSingerFromJamendo(singerId);
          topSingers.push(jamendoData);
        }
        // Trả về dữ liệu tổng hợp
        res.status(200).json({
            topSongs,
            topSingers,
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