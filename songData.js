const axios = require('axios');
const {db, admin}=require('./firebase')
const { MeiliSearch } = require('meilisearch');

const CLIENT_ID=process.env.CLIENT_ID;
// Khởi tạo Meilisearch Client
const meiliClient = new MeiliSearch({ host: 'http://127.0.0.1:7700' }); // Thay bằng URL Meilisearch của bạn
const meiliIndex = meiliClient.index('songs'); // Tên index bạn muốn tạo cho bài hát

// // Lấy danh sách bài hát từ Firebase và lập chỉ mục vào Meilisearch
// async function indexSongsToMeilisearch() {
//   try {
//     const snapshot = await db.collection('song').get();
//     const songs = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     // Tạo chỉ mục trong Meilisearch (nếu chưa có)
//     const response=await meiliIndex.addDocuments(songs);

//   } catch (error) {
//     console.error('Error indexing songs to Meilisearch:', error);
//   }
// }
async function searchInMeilisearch(query) {
  try {

        const searchResult = await meiliIndex.search(query, {
      // Cấu hình fuzzy search và các trường tìm kiếm
      attributesToSearchOn : ['name', 'artist', 'lyric'],
      matchingStrategy: 'all', // Bật fuzzy search (tìm kiếm gần đúng)
      limit: 10,
    });

    if (searchResult.hits.length > 0) {
      
      return searchResult.hits; // Trả về danh sách các bài hát tìm thấy
    }
    return null; // Không tìm thấy kết quả trong Meilisearch
  } catch (error) {
    console.error('Error searching in Meilisearch:', error);
    return null;
  }
}
async function searchInJamendo(query) {
  try {
    const response = await axios.get("https://api.jamendo.com/v3.0/tracks", {
      params: {
        client_id: CLIENT_ID, // Thay bằng CLIENT_ID của bạn
        limit: 10, // Giới hạn kết quả 1 bài hát
        format: "json",
        name: query, // Tìm theo tên bài hát
      },
    });
    const songs = response.data.results;
    if (!songs || songs.length === 0) {
      return { message: 'No songs found on Jamendo', songs: [] };
    }

    const enhancedSongs = await Promise.all(
      songs.map(async (song) => {
        const songId = song.id;

        // Kiểm tra thông tin trong Firebase
        const firebaseDoc = await db.collection('song').doc(songId).get();
        if (!firebaseDoc.exists) {
          await db.collection('song').doc(songId).set({
            name: song.name,
            tag:[],
            composer: "",
            lyric: [],
            play: 0,
          });
        }
        // Bổ sung thông tin mặc định nếu Firebase không có
        const enhancedSong = {
          id: songId,
          name: song.name,
          artist: song.artist_name,
          audio: song.audio,
          image: song.album_image,
          releaseDate: song.releasedate,
          genre: firebaseDoc.data.tags || [], // Lấy thể loại từ tags của Jamendo (nếu có)
          composer: firebaseDoc.data.composer || "", // Giá trị mặc định là rỗng
          lyric: firebaseDoc.data.lyric || [], // Giá trị mặc định là rỗng
          play: firebaseDoc.data.play || 0, // Giá trị mặc định là 0
        };

        return enhancedSong;
      })
    );
    await meiliIndex.addDocuments(enhancedSongs);
    return enhancedSongs;
  } catch (error) {
    console.error('Error searching or enhancing songs:', error);
    throw new Error('Failed to fetch and enhance songs');
  }
};

module.exports={
  searchInMeilisearch,
  searchInJamendo,
}