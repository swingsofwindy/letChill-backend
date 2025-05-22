const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//
const getLyrics=async (req,res)=>{
    const songId=parseInt(req.params.id,10);

    try {
      const song = await prisma.baiHat.findUnique({
        where: { MaBaiHat: songId },
        select: { LoiBaiHat: true }
      });
  
      if (!song) {
        return res.status(404).json({
          error: "SONG_NOT_FOUND",
        });
      }
  
      res.status(200).json({ lyric: song.LoiBaiHat });
    } catch (error) {
      res.status(400).json({
          error: error.message
      })
    }
}

const addLyrics=async (req,res)=>{
    const songId=parseInt(req.params.id,10);
    const lyric=req.body;

    try {
      const updated = await prisma.baiHat.updateMany({
        where: {
          MaBaiHat: songId
        },
        data: {
          LoiBaiHat: lyric
        }
      });
  
      if (updated.count === 0) {
        return res.status(404).json({
          error: 'SONG_NOT_FOUND',
        });
      }
  
      res.status(201).json();
    } catch (error) {
      res.status(400).json({
          error:error.message
      });
    }
}

module.exports={getLyrics, addLyrics}