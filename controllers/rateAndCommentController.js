const { PrismaClient } = require('@prisma/client');
const { default: axios } = require('axios');
const { log } = require('firebase-functions/logger');
const prisma = new PrismaClient();

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
    const songId=parseInt(req.query.songId,10);
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

const addRate=async(req, res)=>{
    const songId=parseInt(req.query.songId,10);
    const{rate, comment}=req.body;
    const uid=req.user.uid;

    try {
      const isToxicComment = await axios.post('http://localhost:8000/analyze_comment', {
        comment: comment
      });
      
      if(isToxicComment.data.is_toxic) {
            return res.status(400).json({ error: 'COMMENT_CONTAINS_INAPPROPRIATE_LANGUAGE' });
      };

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
    const uid=req.user.uid;
    const{rate, comment}=req.body;

    try {
      const isExistsRate = await prisma.danhGia.findUnique({
        where: { 
          MaDanhGia: rateId,
          MaNguoiDung: uid
        }
    });

    if (!isExistsRate) {
        return res.status(404).json({ error: 'RATE_NOT_FOUND' });
    }
    
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
    const uid=req.user.uid;

    try {
        const isExistsRate = await prisma.danhGia.findUnique({
            where: { 
              MaDanhGia: rateId,
              MaNguoiDung: uid
            }
        });

        if (!isExistsRate) {
            return res.status(404).json({ error: 'RATE_NOT_FOUND' });
        }

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

module.exports={
  getRate,
  getRateBySongId,
  addRate,
  updateRate,
  deleteRate
}