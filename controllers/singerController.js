const axios=require('axios')
const { PrismaClient } = require('@prisma/client');
const { error } = require('firebase-functions/logger');
const prisma = new PrismaClient();

//GET thong tin nghe si
const getSinger=async(req,res)=>{
    const artistId=parseInt(req.params.id,10);
    try {
      let singer = await prisma.ngheSi.findUnique({
        where: { 
          MaNgheSi: artistId,
        }
      });
  
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
          return res.status(404).json({ error: "SINGER_NOT_FOUND" });
        }
  
        singer = await prisma.ngheSi.create({
          data: {
            MaNgheSi: artist.id,
            TenNgheSi: artist.name,
            AvatarUrl: artist.image
          }
        });
      }
      
      const followers = await prisma.theoDoi.count({
        where: { MaNgheSi: artistId }
      });
  
      res.status(200).json({
        id: singer.MaNgheSi,
        name: singer.TenNgheSi,
        avatarUrl: singer.AvatarUrl,
        followers: followers
      });
    }
    catch(error){
        res.status(400).json({
          error:error.message
        });
    }
}

const createSinger=async (req, res)=>{
    const {name, avatarUrl}=req.body;
    try {
      const createdSinger = await prisma.ngheSi.create({
        data: {
          TenNgheSi: name,
          AvatarUrl: avatarUrl
        }
      });
  
      res.status(201).json({ 
        id: createdSinger.MaNgheSi,
        name: createdSinger.TenNgheSi,
        avatarUrl: createdSinger.AvatarUrl,
        followers: 0
      });
    } catch (error) {
        res.status(400).json({
          error:error.message
        });
    } 
}

const updateSinger=async (req, res)=>{
    const artistId=parseInt(req.params.id,10);
    const {name, avatarUrl}=req.body;
    try {
      const existingSinger = await prisma.ngheSi.findUnique({
        where: { MaNgheSi: artistId }
      });

      if (!existingSinger) {
        return res.status(404).json({ 
          error: "SINGER_NOT_FOUND" 
        });
      }

      const updatedSinger = await prisma.ngheSi.update({
        where: { MaNgheSi: artistId },
        data: {
          TenNgheSi: name,
          AvatarUrl: avatarUrl
        }
      });

      const followers = await prisma.theoDoi.count({
        where: { MaNgheSi: artistId }
      });
  
      res.status(200).json({
        id: updatedSinger.MaNgheSi,
        name: updatedSinger.TenNgheSi,
        avatarUrl: updatedSinger.AvatarUrl,
        followers: followers
      });
    } catch (error) {
        res.status(400).json({
          error:error.message
        });
    } 
}

const deleteSinger=async (req, res)=>{
    const artistId=parseInt(req.params.id,10);
    try {
      const existingSinger = await prisma.ngheSi.findUnique({
        where: { MaNgheSi: artistId }
      });

      if (!existingSinger) {
        return res.status(404).json({ 
          error: "SINGER_NOT_FOUND" 
        });
      }

      await prisma.ngheSi.delete({
        where: { MaNgheSi: artistId }
      });
  
      res.status(201).json();
    } catch (error) {
        res.status(400).json({
          error:error.message
        });
    } 
}

module.exports={
  getSinger, 
  createSinger,
  updateSinger,
  deleteSinger
};