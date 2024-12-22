require('dotenv').config()
const cors=require('cors')
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

//middleware
app.use(express.json());
app.use(cors());

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

