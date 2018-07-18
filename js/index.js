var express = require('express');
const path = require('path')
var app = express();

const PORT = process.env.PORT || 8000;

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

app.use(express.static(__dirname + '/../'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../views'));

app.get('/', function (req, res) {
    res.render('/index.html');
});


app.get('/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM test_table');
        res.render('pages/db', result);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


app.listen(PORT);