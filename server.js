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
const dashboardRoute=require('./routes/dashboardRoute')

const {deleteAllDocuments}=require('./songData')
const app=express()
//deleteAllDocuments()
//middleware
app.use(express.json());
app.use(cors());

app.use('/api/user', userRoute)
app.use('/api/profile', profileRoute)
app.use('/api/singer', singerRoute)
app.use('/api/rac', rateAndCommentRoute)
app.use('/api/playlist', playlistRoute)
app.use('/api/playlistDetail',playlistDetailRoute)
app.use('/api/lyrics', lyricsRoute)
app.use('/api/songInformation', songInformationRoute)
app.use('/api/search', searchSongRoute)
app.use('/api', dashboardRoute)

app.listen(process.env.PORT, ()=>{
    console.log('Listen on port', process.env.PORT)
})

