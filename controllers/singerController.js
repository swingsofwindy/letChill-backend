const {admin, db}=require('../firebase')
const axios=require('axios')
//GET thong tin nghe si
const getSinger=async(req,res)=>{
    const artistId=req.params.id;
    try{
        const response = await axios.get("https://api.jamendo.com/v3.0/artists", {
            params: {
              client_id: process.env.CLIENT_ID,
              format: 'json',
              id: artistId, // Thay bằng artist_id cần tìm
            },
          });
        const artist = response.data.results[0]; 
        const artistDoc = await db.collection("singers").doc(artistId).get();
        if (!artistDoc.exists) {
            await db.collection('singers').doc(artistId).set({
                artistId: artistId,
                artistName: artist.name,
                followers : 0
            });
          }
        const artistInfo = {
        id: artist.id,
        name: artist.name || "Unknown Artist",
        image: artist.image || "",
        website: artist.website || "",
        shorturl: artist.shorturl || "",
        proImage: artist.pro_image || "",
        musicLinks: artist.musiclinks || [],
        followers: artistDoc.data().followers||0, // Số người theo dõi từ Firebase
        };
        res.status(200).json(artistInfo)
    }
    catch(error){
        res.status(400).json({message:'Fail.', error:error.message});
    }
}

const createSinger=async (req, res)=>{
    const {name, follower}=req.body;
    try {
        await admin.firestore().collection('singer').doc().set({
            name:name,
            follower: follower
        });
        res.status(201).json({
            message: "Success.",
        });
    } catch (error) {
        res.status(400).json({message:"Fail.", error:error.message});
    } 
}

module.exports={getSinger, createSinger};