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

const addLyrics=async (req,res)=>{
    const {songName, newLyric}=req.body;
    try {
        const querySnapshot=await db.collection('song').where('name','==',songName).get();
        if(querySnapshot.empty)
        {
            res.status(404).json({
                message:'No song found.',
                error:error.message
            })
        }
        querySnapshot.forEach(async(doc)=>{
            await doc.ref.update({ lyric:newLyric});
        });
        res.status(201).json({
            message:'All lyrics are updated.'
        })
    } catch (error) {
        res.status(400).json({
            message:'Error updating lyrics.',
            error:error.message
        })
    }
}
module.exports={getLyrics, addLyrics}