'use strict';
const log = console.log

const express = require('express');

const app = express();

app.use(express.static(__dirname + '/pub'))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/pub/welcome.html")
})

app.get("/examples", (req, res) => {
	res.sendFile(__dirname + "/pub/examples.html")
})

app.get("/testing", (req, res) => {
	res.sendFile(__dirname + "/pub/testing.html")
})

app.get('/API', (req, res) => {
	res.sendFile(__dirname + '/pub/docs/index.html')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 