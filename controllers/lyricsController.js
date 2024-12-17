const { db } = require("../firebase");

//
const getLyrics=async (req,res)=>{
    const {songId}=req.body;
    try {
        const firebaseDoc = await db.collection('song').doc(songId).get();
        const lyric={
            lyric:firebaseDoc.data.lyric,
        };
        console.log(firebaseDoc.data())
        res.status(201).json(lyric);
    } catch (error) {
        res.status(400).json({
            message: "Fail.",
            error: error.message
        })
    }
}

module.exports={getLyrics}