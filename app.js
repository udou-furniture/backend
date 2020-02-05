const express = require('express')
const cors = require('cors')
const path = require("path")
require('dotenv').config()

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname, "client", "build")))

app.use(cors({}))

app.use(require('./routes/index'))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

module.exports = app