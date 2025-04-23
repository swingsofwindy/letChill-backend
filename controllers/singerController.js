const axios=require('axios')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//GET thong tin nghe si
const getSinger=async(req,res)=>{
    const artistId=parseInt(req.params.id,10);
    try {
      // Tìm trong DB trước
      let singer = await prisma.ngheSi.findUnique({
        where: { 
          MaNgheSi: artistId,
        }
      });
  
      // Nếu không tìm thấy, gọi Jamendo API và lưu dữ liệu có thể
      if (!singer) {
        const response = await axios.get("https://api.jamendo.com/v3.0/artists", {
          params: {
            client_id: process.env.CLIENT_ID,
            format: 'json',
            id: artistId,
          },
        });
  
        const artist = response.data.results[0];
        if (!artist) {
          return res.status(404).json({ message: "Không tìm thấy ca sĩ trong Jamendo." });
        }
  
        // Tạo mới vào DB (chỉ giữ trường hợp khớp model)
        singer = await prisma.ngheSi.create({
          data: {
            MaNgheSi: artist.id,
            TenNgheSi: artist.name || "Unknown Artist",
            AvatarUrl: artist.image || "",
          }
        });
      }
      
      const followers = await prisma.theoDoi.count({
        where: { MaNgheSi: artistId }
      });

      // Trả về thông tin từ DB
      const artistInfo = {
        MaNgheSi: singer.MaNgheSi,
        TenNgheSi: singer.TenNgheSi,
        AvatarUrl: singer.AvatarUrl,
        SoNguoiTheoDoi: followers
      };
  
      res.status(200).json(artistInfo);
    }
    catch(error){
        res.status(400).json({message:'Fail.', error:error.message});
    }
}

const createSinger=async (req, res)=>{
    const {name, avatarUrl}=req.body;
    try {
      const createdSinger = await prisma.ngheSi.create({
        data: {
          TenNgheSi: name,
          AvatarUrl: avatarUrl || ''
        }
      });
  
      res.status(201).json({ singerId: createdSinger.MaNgheSi });
    } catch (error) {
        res.status(400).json({message:"Fail.", error:error.message});
    } 
}

module.exports={getSinger, createSinger};