const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//GET rate va comment
const getRate=async(req, res)=>{
    const songId=parseInt(req.params.id,10);
    try {
      const rateAndComments = await prisma.danhGia.findMany({
        where: { MaBaiHat: songId },
        include: {
          User: {
            select: {
              TenNguoiDung: true,
              AvatarUrl: true
            }
          }
        }
      });
    
      res.status(200).json({
        rateAndComments: {
          songId: songId,
          list: rateAndComments.map(item => ({
            id: item.MaDanhGia,
            rate: item.MucDanhGia,
            comment: item.BinhLuan,
            creator: {
              creatorName: item.User.TenNguoiDung,
              creatorAvtUrl: item.User.AvatarUrl
            },
          }))
        },
        rateAndCommentsCount: rateAndComments.length
      });
  
      console.log({ songId: songId });
  
    } catch (error) {
        res.status(400).json({message: "Fail", error:error.message});
    }
}

//CREATE rate va comment
const addRate=async(req, res)=>{
    const songId=parseInt(req.params.id,10);
    const{uid,rate, comment}=req.body;
    try {
      const createdRateAndComment = await prisma.danhGia.create({
        data: {
          MaBaiHat: songId,
          MaNguoiDung: uid,
          MucDanhGia: parseInt(rate) || 5,
          BinhLuan: comment
        }
      });
  
      res.status(201).json({ 
        id: createdRateAndComment.MaDanhGia,
        songId: createdRateAndComment.MaBaiHat,
        creator: createdRateAndComment.MaNguoiDung,
        rate: createdRateAndComment.MucDanhGia,
        comment: createdRateAndComment.BinhLuan
       });

    } catch (error) {
        res.status(400).json({
          error:error.message
        });
    }
}

module.exports={
    getRate,
    addRate
}