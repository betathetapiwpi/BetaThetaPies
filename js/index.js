const express = require('express');
const fs = require('fs');
const request = require('request');
const readline = require('readline');
const {google} = require('googleapis');

var app = express();

const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + '/../'));

app.get('/', function (req, res) {
    res.render('/index.html');
});

const {client_secret, client_id, redirect_uris} = JSON.parse(process.env.gapi_credentials).installed;
const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(JSON.parse(process.env.gapi_token));

google.options({
    auth: oAuth2Client
});

oAuth2Client.on('tokens', (tokens) => {
    oAuth2Client.setCredentials(tokens);
});
oAuth2Client.refreshAccessToken();

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getSheet(){
    const sheets = google.sheets({version: 'v4', oAuth2Client});
    sheets.spreadsheets.values.get({
        spreadsheetId: '1Lq3agSSEOv_OKVymELTnvH1Rj9we0GkZS8bvNWjRoiA',
        range: 'C2:C81',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row}`);
            });
        } else {
            console.log('No data found.');
        }
    });
}

app.post('/payments/api', function(req, res){
    data = JSON.parse(req.body);
    note = data.data.note;
    amount = data.data.amount;
    settled = data.data.status === 'settled';

    if (!note.startswith('BTPOO')){
        console.log("Not a BTPies Order");
        res.status(200);
        res.send();
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

    const sheets = google.sheets({version: 'v4', oAuth2Client});
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
                console.log(typeof rows[i][0]);
                if (rows[i][0].includes(date)){
                    for(let j = 0; j < 26; j+=2){
                        if (rows[i+j][2].includes(time)){
                            console.log(rows[i+j]);
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

app.get('/test', function(req, res){
    console.log(req.originalUrl);
    res.send("Hello");
    getSheet();
});

app.listen(PORT);