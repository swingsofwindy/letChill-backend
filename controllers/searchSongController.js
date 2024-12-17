const {searchInMeilisearch, searchInJamendo}=require('../songData')
const CLIENT_ID= process.env.CLIENT_ID;
//
const getListSongs=async(req, res)=>{
    const {query}=req.body;
    try {
      // Tìm kiếm trong Meilisearch
      const meiliResult = await searchInMeilisearch(query);
      
      if (meiliResult) {
        return res.status(200).json(meiliResult); // Trả về kết quả tìm kiếm từ Meilisearch
      }

      // Nếu không tìm thấy trong Meilisearch, tìm kiếm trong Jamendo
      const jamendoResult = await searchInJamendo(query);
  
      if (jamendoResult) {
        // Lưu bài hát từ Jamendo vào Firebase
    
        return res.status(200).json(
          jamendoResult
        ); // Trả về bài hát từ Jamendo
      }
  
      // Nếu không tìm thấy trong cả Firebase, Meilisearch và Jamendo, trả về lỗi 404
      return res.status(404).json({ message: 'Song not found' });
  
    } catch (error) {
      console.error('Error in searchSong function:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports=getListSongs;