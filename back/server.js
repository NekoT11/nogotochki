import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import bcrypt from 'bcrypt'

const app = express();
app.use(cors(), express.json());

const conect = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "nogotochki_db", 
    password: "NwEr9dw4@?", 
});

const PORT = 3000;

// Регистрация
app.post('/api/register', async (req, res) => {
    try {
        const { full_name, login, phone, password } = req.body;
        
        if (!full_name || !login || !phone || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }
        
        const [existing] = await conect.execute(
            'SELECT id FROM user WHERE login = ? OR phone = ?',
            [login, phone]
        );
        
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Логин или телефон уже существует' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await conect.execute(
            'INSERT INTO user (id_role, login, password, full_name, phone) VALUES (1, ?, ?, ?, ?)',
            [login, hashedPassword, full_name, phone]
        );
        
        res.status(201).json({ 
            message: 'Регистрация успешна',
            user_id: result.insertId 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});








app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});