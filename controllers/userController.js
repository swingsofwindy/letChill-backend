const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccountKey.json");
const axios = require('axios');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credential: admin.credential.cert(serviceAccount)
  });
}

// const uid = 'RFxF2oSzqZgWw1IFgbdSawJeEiX2'; // đặt UID tùy ý

// admin.auth().createCustomToken(uid)
//   .then((customToken) => {
//     console.log('Custom token created:', customToken);
//   })
//   .catch((error) => {
//     console.error('Error creating custom token:', error);
//   });

//Login
const signinUser = async (req, res) => {
  const uid = req.body.uid;
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    console.log('Custom token created:', customToken);

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
      {
        token: customToken,
        returnSecureToken: true
      }
    );
    // console.log(token.data);
    const user = await prisma.user.findUnique({
      where: { MaNguoiDung: uid },
      select: {
        Role: true
      }
    });
    res.status(200).json({
      token: response.data,
      role: user.Role,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

//Signup
const signupUser = async (req, res) => {
  const { uid, email, name, birth, gender } = req.body;
  try {
    await prisma.user.create({
      data: {
        MaNguoiDung: uid,
        Email: email,
        TenNguoiDung: name,
        NgaySinh: new Date(birth),
        GioiTinh: gender,
        AvatarUrl: "",
        Role: "USER" // Có thể thêm quyền mặc định nếu cần
      }
    });
    // Tạo playlist mặc định
    const createdUserPlaylist = await prisma.danhSachPhat.create({
      data: {
        MaNguoiDung: uid,
        TenDanhSach: 'Danh sách yêu thích',
        AvatarUrl: 'https://res.cloudinary.com/di4kdlfr3/image/upload/v1736137850/qy5yxyvmevh36ndg1dj7.jpg',
        NgayDang: new Date().toISOString() // Ngày hiện tại
      }
    });

    if (!createdUserPlaylist) {
      await prisma.user.delete({ where: { MaNguoiDung: userRecord.uid } });
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(201).json();
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}



module.exports = { signinUser, signupUser }