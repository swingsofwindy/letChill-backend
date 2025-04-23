const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//
const getPlaylist = async (req, res) => {
  try {
    const playlists = await prisma.danhSachPhat.findMany({
      where: { 
        NOT: { TenDanhSach: 'Danh sách yêu thích' } 
      }, // Exclude "Danh sách yêu thích"
      include: {
        CTDanhSachPhat: true
      }
    });

    const playlistData = playlists.map(p => ({
      id: p.MaDanhSach,
      creator: p.MaNguoiDung,
      name: p.TenDanhSach,
      avtUrl: p.AvatarUrl,
      createdAt: p.NgayDang,
      songsCount: p.CTDanhSachPhat.length
    }));


    res.status(200).json({ 
      playlist: playlistData, 
      playlistCount: playlistData.length});
      
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}


//
const updatePlaylist = async (req, res) => {
    const playlistId = parseInt(req.params.id,10);
    const { name, avtUrl } = req.body;
    try {
      const updatedPlaylist = await prisma.danhSachPhat.update({
        where: { MaDanhSach: playlistId },
        data: {
          TenDanhSach: name,
          AvatarUrl: avtUrl
        }
      });
  
      res.status(200).json({
        updatedPlaylist: {
          id: updatedPlaylist.MaDanhSach,
          name: updatedPlaylist.TenDanhSach,
          avatarUrl: updatedPlaylist.AvatarUrl,
          createdAt: updatedPlaylist.NgayDang
        }
      });
  
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const createPlaylist = async (req, res) => {
    const { uid, name, avtUrl } = req.body;
    try {

      const createdPlaylist = await prisma.danhSachPhat.create({
        data: {
          MaNguoiDung: uid,
          TenDanhSach: name,
          AvatarUrl: avtUrl,
          NgayDang: new Date().toISOString(),
        }
      });
  
      res.status(200).json({ createdPlaylist: {
        id: createdPlaylist.MaDanhSach,
        name: createdPlaylist.TenDanhSach,
        avatarUrl: createdPlaylist.AvatarUrl,
        createdAt: createdPlaylist.NgayDang
      }});

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};


const deletePlaylist = async (req, res) => {
    const playlistId = parseInt(req.params.id,10);
    try {
        // Xóa các bản ghi liên kết trong CT_DanhSachPhat trước
        await prisma.cT_DanhSachPhat.deleteMany({
          where: {
            MaDanhSach: playlistId
          }
        });
    
        // Sau đó xóa chính playlist
        await prisma.danhSachPhat.delete({
          where: {
            MaDanhSach: playlistId
          }
        });
    
        res.status(200).json();
    
        console.log({ playlistId: playlistId });
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    getPlaylist,
    updatePlaylist,
    createPlaylist,
    deletePlaylist
}