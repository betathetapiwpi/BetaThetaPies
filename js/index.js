const express = require('express');
const {google} = require('googleapis');
const moment = require('moment');

var app = express();
app.use(express.static(__dirname + '/../'));

const PORT = process.env.PORT || 80;



const {client_secret, client_id, redirect_uris} = JSON.parse(process.env.gapi_credentials).installed;
const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(JSON.parse(process.env.gapi_token));
console.log(oAuth2Client.credentials);
google.options({
    auth: oAuth2Client
});

oAuth2Client.on('tokens', (tokens) => {
    let refresh_token = oAuth2Client.credentials.refresh_token;
    oAuth2Client.setCredentials(tokens);
    oAuth2Client.setCredentials({refresh_token: refresh_token});
});
oAuth2Client.refreshAccessToken();

const sheets = google.sheets({version: 'v4', auth: oAuth2Client});

app.get('/', function (req, res) {
    res.render('/index.html');
});

app.get('/times', function (req, res){
    console.log("Times requested");
    sheets.spreadsheets.values.get({
        spreadsheetId: '1Lq3agSSEOv_OKVymELTnvH1Rj9we0GkZS8bvNWjRoiA',
        range: 'A2:I81'
    }, (err, data) => {
        if (err){console.log("error"); console.log(err); return;}
        const rows = data.data.values;
        const dateSet = new Set();
        if (rows.length){
            for(let i = 0; i < rows.length; i+=27){
                for(let j = 0; j < 26; j+=2){
                    time = rows[i+j][2];
                    if(rows[i+j][3] !== ''){
                        if(rows[i+j+1][3] !== '' && rows[i+j+1][3] !== undefined){
                            continue;
                        }
                    }
                    dateSet.add(rows[i+j][0]+' '+time);
                }
            }
        }
        res.send(JSON.stringify(Array.from(dateSet)));
    });
});

app.post('/payments/api', function(req, res){
    data = JSON.parse(req.body);
    note = data.data.note;
    amount = data.data.amount;
    settled = data.data.status === 'settled';

    if (!note.startswith('BTPOO')){
        console.log("Not a BTPies Order");
        res.sendStatus(200);
    }

    if (!settled || amount < 10 && data.data.actor.username !== 'Tim-Winters-007') {
        print("Either not settled or too little amount");
        res.sendStatus(200);
    }

    const order = note.substring(5).split(',');
    day = order[4];
    time = order[5];
    day = '2018 01 ' + order[4] + ' ' + order[5] + 'PM';
    date = datetime.strptime(day, '%Y %m %d %I:%M%p').astimezone(timezone('US/Eastern'));

    add_order(order);
    res.status(200);
    res.send();
});

function add_order(order){
    const name = order[0];
    const addr = order[1];
    const cellnumber = order[2];
    const toppings = order[3];
    const date = order[4];
    const time = order[5];
    const notes = order[6];

    sheets.spreadsheets.values.get({
        spreadsheetId: '1Lq3agSSEOv_OKVymELTnvH1Rj9we0GkZS8bvNWjRoiA',
        range: 'A2:I81',
    }, (err, res) => {
        if (err){
            console.log(err);
            return;
        }
        const rows = res.data.values;
        if (rows.length){
            for(let i = 0; i < rows.length; i++){
                if (rows[i][0].includes(date)){
                    for(let j = 0; j < 26; j+=2){
                        if (rows[i+j][2].includes(time)){
                            if(rows[i+j][3] !== ''){j++;}
                            if(rows[i+j][3] !== ''){console.log("Overbook", order); return;}
                            sheets.spreadsheets.values.update({
                                spreadsheetId: '1Lq3agSSEOv_OKVymELTnvH1Rj9we0GkZS8bvNWjRoiA',
                                range: 'D'+(i+j+2)+':I'+(i+j+2),
                                valueInputOption: 'USER_ENTERED',
                                resource: {"values": [[name, cellnumber, addr, toppings, notes, "Venmo"]]}
                            });
                            break;
                        }
                    }
                    break;
                }
            }
        }
    });
}

console.log("Ready");
app.listen(PORT);