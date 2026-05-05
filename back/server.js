import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express();
app.use(cors(), express.json());

const conect = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "nogotochki_db",
    password: "NwEr9dw4@?",
});

const PORT = 3000;

//     регистрация

app.post('/api/register', async (req, res) => {
    try {
        const { full_name, login, phone, password } = req.body;

        if (!full_name || !login || !phone || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        const [existing] = await conect.execute(
            'SELECT id FROM `user` WHERE login = ? OR phone = ?',
            [login, phone]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Логин или телефон уже существует' });
        }

        const [result] = await conect.execute(
            'INSERT INTO `user` (id_role, login, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
            [1, login, password, full_name, phone]
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


//        войти

app.post('/api/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        const [users] = await conect.execute(
            'SELECT * FROM `user` WHERE login = ?',
            [login]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        const user = users[0];

        if (password !== user.password) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        res.json({
            message: 'Успешный вход',
            user: {
                id: user.id,
                login: user.login,
                full_name: user.full_name,
                role: user.id_role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
