const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Filter = require('bad-words');
const filter = new Filter();

const getRate = async (req, res) => {
  try {
    const rateAndComments = await prisma.danhGia.findMany({

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
        rateAndComments: rateAndComments.map(item => ({
          id: item.MaDanhGia,
          songId: item.MaBaiHat,
          creator: {
            name: item.User.TenNguoiDung,
            avatarUrl: item.User.AvatarUrl
          },
          rate: item.MucDanhGia,
          comment: item.BinhLuan,
        })),
        rateAndCommentsCount: rateAndComments.length
      });
  } catch (error) {
    res.status(400).json({
      error:error.message
    });
  }
}

const getRateBySongId=async(req, res)=>{
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
      const averageRate = rateAndComments.reduce((sum, item) => sum + item.MucDanhGia, 0) / rateAndComments.length || 0;
    
      res.status(200).json({
        rateAndComments: {
          averageRate: averageRate,
          list: rateAndComments.map(item => ({
            id: item.MaDanhGia,
            rate: item.MucDanhGia,
            comment: item.BinhLuan,
            creator: {
              name: item.User.TenNguoiDung,
              avatarUrl: item.User.AvatarUrl
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
      if(filter.isProfane(comment)) {
          return res.status(400).json({ error: 'Comment contains inappropriate language.' });
        }
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

const updateRate=async(req, res)=>{
    const rateId=parseInt(req.params.id,10);
    const{rate, comment}=req.body;
    try {
        const updatedRateAndComment = await prisma.danhGia.update({
            where: { MaDanhGia: rateId },
            data: {
                MucDanhGia: parseInt(rate) || 5,
                BinhLuan: comment
            }
        });
        res.status(200).json({ 
            id: updatedRateAndComment.MaDanhGia,
            songId: updatedRateAndComment.MaBaiHat,
            creator: updatedRateAndComment.MaNguoiDung,
            rate: updatedRateAndComment.MucDanhGia,
            comment: updatedRateAndComment.BinhLuan
           });
    } catch (error) {
        res.status(400).json({
          error:error.message
        });
    }
}


const deleteRate=async(req, res)=>{
  
    const rateId=parseInt(req.params.id,10);
    try {
        await prisma.danhGia.delete({
            where: { MaDanhGia: rateId }
        });
        res.status(200).json();
    } catch (error) {
        res.status(400).json({
          error:error.message
        });
    }
}

async function checkComment(comment) {
  const Filter = (await import('bad-words')).default;
  const filter = new Filter();
  
  return filter.isProfane(comment);
}

module.exports={
  getRate,
  getRateBySongId,
  addRate,
  updateRate,
  deleteRate
}