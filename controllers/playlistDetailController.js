const {db, admin}=require('../firebase')

//
const getPlaylistDetail=async (req,res)=>{
    const {playlistId}=req.body;
    try {
        const playlistDoc=await db.collection('playlist').doc(playlistId).get();
        if(!playlistDoc.exists){
            console.log('Playlist not found');
            res.status(400).json({
                message: "Fail.", 
                error:error.message
            });
        }

        const playlistData=playlistDoc.data();
        // Chuyển đổi createdAt thành Date
        playlistData.createdAt = playlistData.createdAt
            ? new Date(playlistData.createdAt._seconds * 1000) // Từ _seconds sang Date
            : null;
        const songIds=playlistData.songIds||[];
        // Lấy thông tin các bài hát
        const songPromises = songIds.map(async (songId) => {
            const songDoc = await db.collection('song').doc(songId).get();
            if (songDoc.exists) {
                const songData = songDoc.data();
                const singerDoc = await db.collection('singer').doc(songData.singerId).get();
                const musicianDoc = await db.collection('musician').doc(songData.musicianId).get();
                const genreDoc = await db.collection('song_genre').doc(songData.genreId).get();

                return {
                    id: songDoc.id,
                    title: songData.title,
                    songUrl: songData.songUrl,
                    avatarUrl: songData.avatarUrl,
                    createdAt: songData.createdAt ? new Date(songData.createdAt._seconds * 1000) : null,
                    views: songData.views,
                    singer: singerDoc.exists ? singerDoc.data().name : null,
                    musician: musicianDoc.exists ? musicianDoc.data().name : null,
                    genre: genreDoc.exists ? genreDoc.data().name : null,
                };
            }
            return null; // Nếu bài hát không tồn tại
        });
        const songs = (await Promise.all(songPromises)).filter(song => song !== null);

        res.status(201).json({
            playlist: playlistData,
            songs:songs,
            message:"Success."
        })

    } catch (error) {
        res.status(400).json({
            message: "Fail.", 
            error:error.message
        })
    }
}

//
const addSongToPlaylist= async (req, res)=>{
    const {playlistId, songId}=req.body;
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
    const {playlistId, songId}=req.body;
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