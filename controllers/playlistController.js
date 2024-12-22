const { doc } = require('@firebase/firestore');
const {db, admin}=require('../firebase')
//
const getPlaylist= async (req, res)=>{
    try {
        const playlistSnapshot=await db.collection('playlist').get();
        const playlistData=playlistSnapshot.docs.map(doc=>{
            const data=doc.data();

            return{
                id:doc.id,
                creator: data.creator,
                name: data.name,
                avtUrl: data.avtUrl,
                description: data.description,
                createdAt: data.createdAt
                    ? new Date(data.createdAt._seconds * 1000) // Chuyển đổi từ _seconds sang Date
                    : null,
                countSongs: data.songIds.length
            }
        })
        
        res.status(201).json({
                    playlist: playlistData
                })
    } catch (error) {
        res.status(400).json({
            message: "Fail.",
            error: error.message
        })
    }
}


//
const updatePlaylist= async (req, res)=>{
    const {playlistId, name, avtUrl, description}=req.body;
    try {
        const playlistRef=db.collection('playlist').doc(playlistId);
        await playlistRef.update({
            name:name,
            avtUrl:avtUrl,
            description: description
        });
        res.status(201).json({
            message: "Success."
        })
    } catch (error) {
        res.status(400).json({
            message: "Fail.", 
            error:error.message
        })
    }
}

//
const addPlaylist= async (req, res)=>{
    const {uid,name,avtUrl, description}=req.body;
    try {
        await db.collection('playlist').doc().set({
            creator: uid,
            name:name,
            avtUrl: avtUrl,
            description: description,
            songIds:[],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({
            message: "Success.",
        });
    } catch (error) {
        res.status(400).json({
            message:"Fail.",
            error:error.message
        })
    }
}

const deletePlaylist= async (req, res)=>{
    const {playlistId}=req.body;
    try {
        await db.collection('playlist').doc(playlistId).delete();
        res.status(201).json({message: "Success."});
    } catch (error) {
        res.status(400).json({
            message:"Fail.",
            error: error.message
        })
    }
}

module.exports={
    getPlaylist, 
    updatePlaylist, 
    addPlaylist, 
    deletePlaylist
}