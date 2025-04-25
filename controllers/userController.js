const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    credential: admin.credential.cert(serviceAccount)
  });
}


//Login
const signinUser = async (req, res) => {
  const { email } = req.body;
  try {
    await admin.auth().getUserByEmail(email);
    res.status(200).json();
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

//Signup
const signupUser = async (req, res) => {
  const { email, password, name, birth, gender } = req.body;
  try {
    const createdFBUser = await admin.auth().createUser({
      email: email,
      password: password
    });

    const createdDBUser = await prisma.user.create({
      data: {
        MaNguoiDung: createdFBUser.uid,
        Email: email,
        TenNguoiDung: name,
        NgaySinh: new Date(birth),
        GioiTinh: gender,
        AvatarUrl: "",
        Role: "USER" // Có thể thêm quyền mặc định nếu cần
      }
    });

    if (!createdDBUser) {
      await admin.auth().deleteUser(createdFBUser.uid);
      return res.status(400).json({
        error: error.message
      });
    }
    // Tạo playlist mặc định
    const createdUserPlaylist = await prisma.danhSachPhat.create({
      data: {
        MaNguoiDung: createdFBUser.uid,
        TenDanhSach: 'Danh sách yêu thích',
        AvatarUrl: 'https://res.cloudinary.com/di4kdlfr3/image/upload/v1736137850/qy5yxyvmevh36ndg1dj7.jpg',
        NgayDang: new Date().toISOString() // Ngày hiện tại
      }
    });

    if (!createdUserPlaylist) {
      await prisma.user.delete({ where: { MaNguoiDung: userRecord.uid } });
      await admin.auth().deleteUser(createdFBUser.uid);
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