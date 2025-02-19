const fetch = require('node-fetch');
require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const options = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/favorites/add', async (req, res) => {
    const { user_id, recipe_id } = req.body;
    try {
        await pool.query(
            `INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)`,
            [user_id, recipe_id]
        );
        res.json({ success: true, message: 'Рецепт добавлен в избранное' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.get("/api/favorites/random", async (req, res) => {
    const userId = req.query.user_id;
    
    if (!userId) {
        return res.status(400).json({ success: false, message: "Не указан user_id" });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            "SELECT recipe_Id FROM favorites WHERE user_Id = $1",
            [userId]
        );
        client.release();

        if (result.rows.length === 0) {
            return res.json({ success: false, message: "Нет рецептов!" });
        }

        const randomRecipe = result.rows[Math.floor(Math.random() * result.rows.length)].recipe_id;

        const response = await globalThis.fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomRecipe}`);
        const data = await response.json();

        if (!data.meals) {
            return res.json({ success: false, message: "Рецепт не найден!" });
        }

        res.json({ success: true, recipe: data });
    } catch (error) {
        console.error("Ошибка при получении избранного рецепта:", error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
});

https.createServer(options, app).listen(8080, () => {
    console.log('Сервер запущен на https://localhost:8080');
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Успешное подключение к базе данных:', res.rows[0]);
    }
});