const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_FuZlPuaOnR30MYPqIxK3Efs5");
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
client.connect();
var app = express();
app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const PORT = process.env.PORT || 8000;


app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/orders', function (req, res) {
    res.render('orders.html');
});

app.get('/orders/orders', function (req, res) {
    let orders = [];
    client.query("select date, time, name, address, phone, topping, notes from orders order by id", (err, res_) => {
        if (err) throw err;
        for (let row of res_.rows) {
            orders.push(row);
        }
        res.send(JSON.stringify(orders));
    });

});

app.get('/times', function (req, res) {
    let times = [];
    client.query("select date || ' ' || time as datetime from orders where name='' group by date, time order by date, time;", (err, res_) => {
        if (err) throw err;
        for (let row of res_.rows) {
            times.push(new Date(row.datetime));
        }
        res.send(JSON.stringify(times));
    });
});

app.post('/submit', function (req, res) {
    let body = req.body;
    const date = body.date;
    const time = body.time;
    const name = body.name;
    const address = body.address;
    const phone = body.cellnumber;
    const toppings = [body.sauce,
        body.cheese,
        body.pepperoni,
        body.bacon,
        body.onion,
        body['green pepper'],
        body.sausage,
        body.mushroom].join('/');
    const notes = body.notes;
    const finalNote = [date, time, name, address, phone, toppings, notes].join();
    return res.redirect("venmo://paycharge?txn=pay&recipients=BetaThetaPi-WPI&amount=10&note=BTPOO" + finalNote);

});

app.post('/checkout', function (req, res) {
    const token = req.body.id;
    const note = req.body.note;
    stripe.charges.create({
        amount: 1000,
        currency: 'usd',
        description: 'Beta Theta Pies Pizza',
        source: token
    });
    add_order(note.split(',') + ['Stripe']);
});

app.post('/api/purchase', function (req, res) {
    let data = req.body;
    let note = data.data.note;
    let amount = data.data.amount;
    console.log(note);
    let settled = data.data.status === 'settled';

    if (!note.startsWith('BTPOO')) {
        console.log("Not a BTPies Order");
        res.sendStatus(200);
    }

    const order = note.substring(5).split(',');

    if (!settled || (amount < 10 && data.data.actor.username !== 'Tim-Winters-007')) {
        order.concat(['Venmo: Only paid ' + amount]);
    }
    else{
        order.concat('Venmo');
    }

    add_order(order);
    res.status(200);
    res.send();
});


function add_order(order) {
    const name = order[0];
    const addr = order[1];
    const cellnumber = order[2];
    const toppings = order[3];
    const date = order[4];
    const time = order[5];
    const notes = order[6];
    const meth = order[7];
    client.connect();
    client.query("UPDATE order set name = $1 address=$2 phone=$3 toppings=$4 notes=$5 paidwith=$6 where id = " +
        "(Select id from orders where date='$7' and time='$8' and name = '' limit 1)",
        name, addr, cellnumber, toppings, notes, meth, date, time);
}

console.log("Ready");
app.listen(PORT);
