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

        return res.status(201).json({
            message: 'Регистрация успешна',
            user_id: result.insertId
        });

    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
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

        return res.json({
            message: 'Успешный вход',
            user: {
                id: user.id,
                login: user.login,
                full_name: user.full_name,
                role: user.id_role
            }
        });

    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
});



///    заявкм

app.get('/api/requests', async (req, res) => {
    try {
        const [rows] = await conect.execute(`
            SELECT 
                request.id,
                user.full_name AS user_name,
                master.name AS master_name,
                status.name AS status_name,
                request.booking_datetime
            FROM request
            JOIN user ON request.id_user = user.id
            JOIN master ON request.id_master = master.id
            JOIN status ON request.id_status = status.id
            ORDER BY request.id DESC
        `);
        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});



// выборочн заявки

app.get('/api/requests/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const [rows] = await conect.execute(`
            SELECT 
                request.id,
                master.name AS master_name,
                status.name AS status_name,
                request.booking_datetime
            FROM request
            JOIN master ON request.id_master = master.id
            JOIN status ON request.id_status = status.id
            WHERE request.id_user = ?
            ORDER BY request.id DESC
        `, [userId]);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});



//  изменить статус заявки
app.put('/api/requests/status/:id', async (req, res) => {
    try {
        const requestId = req.params.id;
        const { statusId } = req.body;

        await conect.execute(
            'UPDATE request SET id_status = ? WHERE id = ?',
            [statusId, requestId]
        );

        res.json({ message: 'Статус обновлён' });

    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
 
// мастера
app.get('/api/masters', async (req, res) => {
    try {
        const [rows] = await conect.execute("SELECT id, name FROM master");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


// sozdanie zaivki 
app.post('/api/requests/create', async (req, res) => {
    try {
        const { id_user, id_master, booking_datetime } = req.body;

        await conect.execute(
            'INSERT INTO request (id_user, id_master, id_status, booking_datetime) VALUES (?, ?, ?, ?)',
            [id_user, id_master, 1, booking_datetime]
        );

        res.json({ message: "Заявка создана" });

    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});






app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
