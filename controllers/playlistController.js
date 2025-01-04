const { doc } = require('@firebase/firestore');
const { db, admin } = require('../firebase')
//
const getPlaylist = async (req, res) => {
    try {
        const playlistSnapshot = await db.collection('playlist').get();
        const playlistData = playlistSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                creator: data.creator,
                name: data.name,
                avtUrl: data.avtUrl,
                description: data.description,
                createdAt: data.createdAt
                    ? new Date(data.createdAt._seconds * 1000) // Chuyển đổi từ _seconds sang Date
                    : null,
            }
        })

        res.status(201).json({
            playlist: playlistData
        })
        // const playlistData=[
        //     {
        //     "id":"1",
        //     "creator":"Smile",
        //     "name":"Chill",
        //     "avtUrl":"https://basicns.com/images/Dap%20noi%20ban%20sat%20di%20hoc%20long%20banner.jpg",
        //     "description":"Chill đi.",
        //     "countSongs":0
        // },
        // {
        //     "id":"2",
        //     "creator":"Smile",
        //     "name":"Chill",
        //     "avtUrl":"https://basicns.com/images/Dap%20noi%20ban%20sat%20di%20hoc%20long%20banner.jpg",
        //     "description":"Chill đi.",
        //     "countSongs":0
        // }
    //]
        // res.status(201).json({
        //     playlist: playlistData
        // })
    } catch (error) {
        res.status(400).json({
            message: "Fail.",
            error: error.message
        })
    }
}


//
const updatePlaylist = async (req, res) => {
    const playlistId = req.params.id;
    const { name, avtUrl, description } = req.body;
    try {
        const playlistRef = db.collection('playlist').doc(playlistId);
        await playlistRef.update({
            name: name,
            avtUrl: avtUrl,
            description: description
        });
        res.status(201).json({
            message: "Success."
        })
        console.log(req.body)
    } catch (error) {
        res.status(400).json({
            message: "Fail.",
            error: error.message
        })
    }
}

const addPlaylist = async (req, res) => {
    const { uid, name, avtUrl, description } = req.body;
    try {
        // Tạo playlist mới
        const newPlaylistRef = db.collection('playlist').doc();
        await newPlaylistRef.set({
            creator: uid,
            name: name,
            avtUrl: avtUrl || '',
            description: description || '',
            songIds: [],
        });

        // Trả về ID của playlist mới tạo
        res.status(201).json({
            message: "Success.",
            id: newPlaylistRef.id,
        });
        console.log(req.body)
    } catch (error) {
        console.error("Error adding playlist:", error); // Ghi log ra console
        res.status(400).json({
            message: "Fail.",
            error: error.message,
        });
    }
};


const deletePlaylist = async (req, res) => {
    const playlistId = req.params.id;
    try {
        await db.collection('playlist').doc(playlistId).delete();
        res.status(201).json({ message: "Success." });
    } catch (error) {
        res.status(400).json({
            message: "Fail.",
            error: error.message
        })
    }
    console.log({playlistId: playlistId});
}

module.exports = {
    getPlaylist,
    updatePlaylist,
    addPlaylist,
    deletePlaylist
}