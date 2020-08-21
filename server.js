'use strict';
const log = console.log

const express = require('express');

const app = express();

app.use(express.static(__dirname + '/pub'))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/pub/examples.html")
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 