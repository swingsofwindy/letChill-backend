require('dotenv').config()
const cors = require('cors')
const express = require('express')

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('./swagger-output.json');

const checkExpiry = require('./cron/checkExpiry');
const notifyExpiry = require('./cron/notifyExpiry');
const cron = require('node-cron');

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
const reportRoute = require('./routes/reportRoute')
const subscriptionRoutes = require('./routes/subscriptionRoute');

const app = express()
app.use(express.json());
app.use(cors());

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

app.use('/api/user', userRoute)
app.use('/api/profile', profileRoute)
app.use('/api/singer', singerRoute)
app.use('/api/rate-and-comment', rateAndCommentRoute)
app.use('/api/playlist', playlistRoute)
app.use('/api/playlist-detail', playlistDetailRoute)
app.use('/api/lyric', lyricsRoute)
app.use('/api/song', songRoute)
app.use('/api/search', searchSongRoute)
app.use('/api/dashboard', dashboardRoute)
app.use('/api/report', reportRoute)
app.use('/api/subscription', subscriptionRoutes);

cron.schedule('0 0 * * *', async () => {
    await checkExpiry();
    await notifyExpiry();
  });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(process.env.PORT, () => {
    console.log('Listen on port', process.env.PORT)
})

