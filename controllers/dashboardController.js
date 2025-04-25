const axios=require('axios');
const {searchMeilisearch}=require('../songData')
  
  async function getSingerFromJamendo(singerId) {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/artists', {
        params: {
          client_id: process.env.CLIENT_ID,
          format: 'json',
          limit: 1, 
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
  const user_id  = parseInt(req.query.user_id,10); 
  const top_n = parseInt(req.query.top_n,10); 
  try {       
      const songsRecommentation = await axios.get('http://127.0.0.1:8000/recommendations', {
        params: {
          user_id: user_id, 
          top_n: top_n
        },
      });
      const singerIds=[479140,543065,546016,439371, 7]
      const singersRecommentation = [];

      for (const singerId of singerIds) {
        const jamendoData = await getSingerFromJamendo(singerId);
        singersRecommentation.push(jamendoData);
      }
      res.status(200).json({
          songsRecommentation: songsRecommentation.data,
          singersRecommentation: singersRecommentation
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