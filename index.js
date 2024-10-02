import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mySuperSecretKey123',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { first_name, last_name, address, district, city, province, postal_code, phone_number, team_prediction } = req.body;

    try {
        await pool.query(
            'INSERT INTO participants (first_name, last_name, address, district, city, province, postal_code, phone_number, team_prediction) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [first_name, last_name, address, district, city, province, postal_code, phone_number, team_prediction]
        );
        res.render("register", {
            wasCorrect: true,
        });
    } catch (err) {
        console.error(err);
        res.send('เกิดข้อผิดพลาด');
    }
});

app.get('/admin/login', (req, res) => {
    if (req.session.admin) {
        return res.redirect('/admin');
    }
    res.render('admin');
});



app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    const adminUsername = 'admin';

    const adminPasswordHash = '$2a$10$VZd3v6PbeoKdjqDsWmQ1fubB4j2kwZn6sC4fDBqXNp8.9RAiaMnJ2';

    if (username === adminUsername && await bcrypt.compare(password, adminPasswordHash)) {
        req.session.admin = true;
        res.redirect('/admin');
    } else {
        res.send('รหัสผ่านไม่ถูกต้อง');
    }
});


app.get('/admin', async (req, res) => {
    console.log(req.session);
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const teamFilter = req.query.team || null;
    let query = 'SELECT * FROM participants';
    const values = [];

    if (teamFilter) {
        query += ' WHERE team_prediction = $1';
        values.push(teamFilter);
    }

    try {
        const result = await pool.query(query, values);
        res.render('adminpage', { participants: result.rows, teamFilter });
    } catch (err) {
        console.error(err);
        res.send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
