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
    } catch (error) {
        res.status(400).json({
            message: "Fail.",
            error: error.message
        })
    }
}

const addPlaylist = async (req, res) => {
    const { uid, name, avtUrl, description } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!uid || !name) {
        return res.status(400).json({
            message: "Missing required fields: 'uid' or 'name'.",
        });
    }

    try {
        // Kiểm tra xem playlist có bị trùng lặp không
        const existingPlaylist = await db.collection('playlist')
            .where('name', '==', name)
            .get();

        if (!existingPlaylist.empty) {
            return res.status(400).json({
                message: "Playlist with this name already exists.",
            });
        }

        // Tạo playlist mới
        const newPlaylistRef = db.collection('playlist').doc();
        await newPlaylistRef.set({
            creator: uid,
            name: name,
            avtUrl: avtUrl || '',
            description: description || '',
            songIds: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastPlayed: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Trả về ID của playlist mới tạo
        res.status(201).json({
            message: "Success.",
            id: newPlaylistRef.id,
        });
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
}

module.exports = {
    getPlaylist,
    updatePlaylist,
    addPlaylist,
    deletePlaylist
}