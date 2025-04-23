const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//GET profile
const getProfile= async (req, res)=>{
    const uid=req.params.id;
    try {
      // Lấy thông tin người dùng và danh sách phát liên quan
      const user = await prisma.user.findUnique({
        where: { MaNguoiDung: uid },
        include: {
          DanhSachPhat: {
            select: {
              MaDanhSach: true,
              TenDanhSach: true,
              AvatarUrl: true
            }
          }
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const playlistCount = user.DanhSachPhat.length;
      res.status(200).json({
        name: user.TenNguoiDung,
        imageUrl: user.AvatarUrl,
        playlist: user.DanhSachPhat.map(p => ({
          id: p.MaDanhSach,
          name: p.TenDanhSach,
          avtUrl: p.AvatarUrl
        })),
        playlistCount: playlistCount
      });
    } catch(error){
        res.status(400).json({message:'Fail.', error:error.message});
    }
}

//UPDATE profile
const updateProfile=async(req, res)=>{
    const uid=req.params.id;
    const {newName, imageUrl}=req.body;
    try {
      await prisma.user.update({
        where: { MaNguoiDung: uid },
        data: {
          TenNguoiDung: newName,
          AvatarUrl: imageUrl
        }
      });
  
      res.status(200).json({ message: "Profile update success!" });
  
    } catch(error){
        res.status(400).json({message:'Fail.', error:error.message});
    }
}

module.exports={
    getProfile,
    updateProfile
}