const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const socketio = require('socket.io')

const VERSION = '1.0.0 - Project Init';
const PORT = 5000;

app.use(cors());

app.use(express.json());

app.listen(PORT, () =>{
    console.log(`SERVER IS RUNNING ON ${PORT}`);
    console.log(`VERSION: ${VERSION}`);
});

app.put('/video', (req, res) =>{
    res.send('Hello world');
});

