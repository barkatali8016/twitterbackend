const express = require('express');
require('dotenv').config();
//DB CONNECTION
require('./connection/connection');
const cors = require('cors');
const http = require('http')
const path = require('path')
const socketIo = require('socket.io')
const config = require('dotenv').config()
const TOKEN = process.env.TWITTER_BEARER_TOKEN



// creating server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);


//import routes 
// const authRoute = require('./routes/auth');
const twitterRoute = require('./routes/twitter');


// middlewares are comes here

app.use(express.json());
app.use(cors());
// app.use(function(req, res, next) {
//     req.io = io;
//     next();
// });


//localhost:3000/
app.get('/', (req, res) => {
    res.send('Welcome to the server.')
})

// custom middlewares and routes

app.use('/api/twitter', twitterRoute);

//socket io 
const { streamTweets } = require('./controllers/twitter');
const { deleteRules } = require('./controllers/twitter');
io.on('connection', async () => {
    console.log('Client connected...')
    streamTweets(io);

    // let timeout = 0
    // if(filteredStream){
    //     console.log(filteredStream)
    //     filteredStream.on('timeout', () => {
    //         // Reconnect on error
    //         console.warn('A connection error occurred. Reconnecting…')
    //         setTimeout(() => {
    //             timeout++
    //             streamTweets(io)
    //         }, 2 ** timeout)
    //         streamTweets(io)
    //     })
    // }
    
})

//port
const port = process.env.PORT || 3000;

//server listening 
server.listen(port, () => { console.log(`Server is listening on localhost:${port}`) });