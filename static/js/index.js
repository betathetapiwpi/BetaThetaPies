const express = require('express');
const https = require('https');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const moment = require('moment');
const stripe = require("stripe")("sk_test_FuZlPuaOnR30MYPqIxK3Efs5");

var app = express();
app.use(express.static('static'));
app.all( '/', function(req, res, next) {
    if ((req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
    } else
        next();
});

const options = {
    cert: fs.readFileSync('./fullchain.pem'),
    key: fs.readFileSync('./privkey.pem')
};

const PORT = process.env.PORT || 8000;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
	if (err) return console.log('Error loading client secret file:', err);
	authorize(JSON.parse(content));
});

var oAuth2Client;
/**
 *  * Create an OAuth2 client with the given credentials, and then execute the
 *   * given callback function.
 *    * @param {Object} credentials The authorization client credentials.
 *     * @param {function} callback The callback to call with the authorized client.
 *      */
function authorize(credentials) {
	const {client_secret, client_id, redirect_uris} = credentials.installed;
	oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	  // Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
	       if (err) return getNewToken(oAuth2Client);
	           oAuth2Client.setCredentials(JSON.parse(token));
	                 });
	                 }
//const {client_secret, client_id, redirect_uris} = JSON.parse(process.env.gapi_credentials).installed;
//const oAuth2Client = new google.auth.OAuth2(
//    client_id, client_secret, redirect_uris[0]);
//oAuth2Client.setCredentials(JSON.parse(process.env.gapi_token));
//console.log(oAuth2Client.credentials);

/**
 *  * Get and store new token after prompting for user authorization, and then
 *   * execute the given callback with the authorized OAuth2 client.
 *    * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 *     * @param {getEventsCallback} callback The callback for the authorized client.
 *      */
function getNewToken(oAuth2Client) {
	  const authUrl = oAuth2Client.generateAuthUrl({
		      access_type: 'offline',
		      scope: SCOPES,
		    });
	  console.log('Authorize this app by visiting this url:', authUrl);
	  const rl = readline.createInterface({
		      input: process.stdin,
		      output: process.stdout,
		    });
	  rl.question('Enter the code from that page here: ', (code) => {
		      rl.close();
		      oAuth2Client.getToken(code, (err, token) => {
			            if (err) return console.error('Error while trying to retrieve access token', err);
			            oAuth2Client.setCredentials(token);
			            // Store the token to disk for later program executions
			             fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
			                     if (err) console.error(err);
			                             console.log('Token stored to', TOKEN_PATH);
			                                   });
			                                             });
			                                               });
			                                               }
			      


app.get('/', function (req, res) {
    res.render('index.html');
});
app.get('/times', function (req, res){
	sheets = google.sheets({version: 'v4', oAuth2Client});
    sheets.spreadsheets.values.get({
	    auth: oAuth2Client,
        spreadsheetId: '1Lq3agSSEOv_OKVymELTnvH1Rj9we0GkZS8bvNWjRoiA',
        range: 'A2:I159'
    }, (err, data) => {
        if (err){console.log("error"); console.log(err); return;}
        const rows = data.data.values;
        const dateSet = new Set();
        if (rows.length){
            for(let i = 0; i < rows.length; i+=53){
                for(let j = 0; j < 52; j+=4){
                    time = rows[i+j][2];
		    for (let k = 0; k < 4; k++){
			    if (rows[i+j+k][3] === '' || rows[i+j+k][3] === undefined){
				dateSet.add(rows[i+j][0]+' ' +time);
				break;
			}
                    }
                }
            }
        }
        res.send(JSON.stringify(Array.from(dateSet)));
    });
});

app.post('/checkout', function (req, res){

	console.log("HE WENT TO CHECKOUT");
	const token = req.body.stripeToken;
	const charge = stripe.charges.create({
		  amount: 1000,
		  currency: 'usd',
		  description: 'Beta Theta Pies Pizza',
		  source: token,
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
https.createServer(options, app).listen(8443);
