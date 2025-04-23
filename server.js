require('dotenv').config()
const cors = require('cors')
const express = require('express')
const userRoute = require('./routes/userRoute')
const profileRoute = require('./routes/profileRoute')
const singerRoute = require('./routes/singerRoute')
const rateAndCommentRoute = require('./routes/rateAndCommentRoute')
const playlistRoute = require('./routes/playlistRoute')
const playlistDetailRoute = require('./routes/playlistDetailRoute')
const lyricsRoute = require('./routes/lyricsRoute')
const songRoute = require('./routes/songRoute')
const searchSongRoute = require('./routes/searchSongRoute')
const dashboardRoute = require('./routes/dashboardRoute')

const app = express()

app.use(express.json());
app.use(cors());

app.use('/api/user', userRoute)
app.use('/api/profile', profileRoute)
app.use('/api/singer', singerRoute)
app.use('/api/rate-and-comment', rateAndCommentRoute)
app.use('/api/playlist', playlistRoute)
app.use('/api/playlist-detail', playlistDetailRoute)
app.use('/api/lyric', lyricsRoute)
app.use('/api/song', songRoute)
app.use('/api/search', searchSongRoute)
app.use('/api', dashboardRoute)

app.listen(process.env.PORT, () => {
    console.log('Listen on port', process.env.PORT)
})

