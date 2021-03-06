var express = require("express")
var app = express()
var http = require("http").createServer(app)
var router = require("./routes/routes")
var cors = require("cors")
var io = require('socket.io')(http)
require('./modules/socket')(io)

const port = process.env.PORT || 3000;

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())

app.use("/", router);

http.listen(port, () => {
    console.log("Servidor rodando em http://localhost:3000")
});