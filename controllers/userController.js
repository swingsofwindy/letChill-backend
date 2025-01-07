

const admin = require('firebase-admin');
const { db } = require('../firebase')

//Login
const signinUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        res.status(200).json({ message: "Đăng nhập thành công", uit: user.uid });
    } catch (error) {
        res.status(400).json({ message: "Đăng nhập thất bại", error: error.message });
    }
}

//Signup
const signupUser = async (req, res) => {
    const { email, password, name, birth, gender } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password
        });
        console.log("Đăng ký thành công")

        await admin.firestore().collection('users').doc(userRecord.uid).set({
            userId: userRecord.uid,
            name: name,
            birth: birth,
            gender: gender,
            imageUrl: ""
        });

        const newPlaylistRef = db.collection('playlist').doc();
        await newPlaylistRef.set({
            creator: userRecord.uid,
            name: 'Danh sách yêu thích',
            avtUrl: 'https://res.cloudinary.com/di4kdlfr3/image/upload/v1736137850/qy5yxyvmevh36ndg1dj7.jpg',
            description: 'Danh sách yêu thích của tôi',
            songIds: [],
        });

        res.status(201).json({
            message: "Đăng ký thành công!",
            uid: userRecord.uid
        });
    } catch (error) {
        res.status(400).json({ message: "Đăng ký thất bại!", error: error.message });
    }
}

module.exports = { signinUser, signupUser }