const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();

const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};

app.get('/', (req, res) => {
    console.log(path.join(__dirname+'/index.html'));
    res.sendFile(path.join(__dirname+'/index.html'));
});

https.createServer(options, app).listen(8080);