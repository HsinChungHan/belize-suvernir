'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json());



var http = require('http');
http.createServer(function (req, res) {
    if (req.url == '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.write('<h1>index!</h1>');
        res.end();
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.write('<h1>404</h1>');
        res.end();
    }
    //process.env.PORT由主機決定port是多少
    //或主機沒有設定port的話，就指定port為3000
}).listen(process.env.PORT || 3000);


//create the endpoint of our webhook
//加入 Webhook 端點
app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});


//Adds support for GET requests to our webhook
//加入 Webhook 驗證

app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "testWebhook"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});




app.get('/', (req, res) => {

    console.log('Its fine');
});
