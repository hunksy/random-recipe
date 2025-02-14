const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

https.createServer(options, app).listen(8080);