import { app } from './db.js';
import fs from 'fs';
import https from 'https'

const options = {
    key: fs.readFileSync('../config/localhost-key.pem'),
    cert: fs.readFileSync('../config/localhost.pem'),
};

https.createServer(options, app).listen(8080, () => {
    console.log('Сервер запущен на https://localhost:8080');
});
