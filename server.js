require('dotenv').config()

const express=require('express')
const userRoute=require('./routes/userRoute')
const profileRoute=require('./routes/profileRoute')
const singerRoute=require('./routes/singerRoute')
const rateAndCommentRoute=require('./routes/rateAndCommentRoute')
const playlistRoute=require('./routes/playlistRoute')
const playlistDetailRoute=require('./routes/playlistDetailRoute')
const lyricsRoute=require('./routes/lyricsRoute')
const songInformationRoute=require('./routes/songInformationRoute')
const searchSongRoute=require('./routes/searchSongRoute')
const { indexSongsToMeilisearch } = require('./songData'); // Import các hàm

const app=express()

const db = require('./firebase');
// Chạy fetchSongs để thêm dữ liệu vào Meilisearch

app.get("/addData", async (req, res) => {
  try {
    const data = {
      name: 'Nguyen Van A',
      birth:"10/10/2004",
      gender: "male",
      email: 'abc@gmail.com',
      password:'***'
    };    
    console.log(data)
    await db.collection("users").add(data);
    res.status(200).send("Data added successfully!");
    console.log('Data added successfully!')
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send("Error adding data");
  }
});

//middleware
app.use(express.json());

app.get('/api',(req,res)=>{
    res.json({mssg:'Pikachu'})
})

app.use('/api/user', userRoute)
app.use('/api/profile', profileRoute)
app.use('/api/singer', singerRoute)
app.use('/api/rac', rateAndCommentRoute)
app.use('/api/playlist', playlistRoute)
app.use('/api/playlistDetail',playlistDetailRoute)
app.use('/api/lyrics', lyricsRoute)
app.use('/api/songInformation', songInformationRoute)
app.use('/api/search', searchSongRoute)

app.listen(process.env.PORT, ()=>{
    console.log('Listen on port', process.env.PORT)
})

