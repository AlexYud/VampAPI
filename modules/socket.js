var Validate = require('./validate')
var Match = require('../models/Match')
var Countdown = require('./countdown')

let users = []
let called = false

module.exports = function (io) {
  io.on("connection", (socket) => {

    socket.on("disconnect", () => {
      users = users.filter(u => u.id !== socket.id)
      io.emit("new user", users)
    })

    socket.on("dis", () => {
      users = users.filter(u => u.id !== socket.id)
      io.emit("new user", users)
    })

    socket.on('load characters', () => {
      Match.dataChar(socket)
    })

    socket.on("join lobby", (name) => {
      if (Validate.validate(name)) {
        const user = {
          id: socket.id,
          username: name,
          character: -1,
        }
        users.push(user)
        socket.emit("join ok")
        io.emit("new user", users)
      } else {
        socket.emit("error", "Nome inválido!")
      }
    })

    socket.on("load lobby", () => {
      socket.emit("new user", users)
    })

    socket.on("start countdown lb", () => {
      if (called == false) {
        called = true
        Countdown(io, 3).then(res => {
          if (res) {
            Match.start(io, users)
            called = false
          }
        }).catch(erro => {
          console.log(erro)
        })
      }
    })

    socket.on("load night", () => {
      Match.night(io, socket)
    })

    socket.on("start countdown ng", () => {
      if (called == false) {
        called = true
        Countdown(io, 20).then(res => {
          if (res) {
            called = false
          }
        })
      }
    })

    socket.on("loading", () => {
      if (called == false) {
        called = true
        Countdown(io, 3).then(res => {
          if (res) {
            called = false
            Match.isOver(io, true)
          }
        })
      }
    })

    socket.on("wait", () => {
      if (called == false) {
        called = true
        Countdown(io, 3).then(res => {
          if (res) {
            called = false
            Match.bonfireResult(io)
          }
        })
      }
    })

    socket.on("load bonfire", () => {
      Match.bonfire(io, socket)
    })

    socket.on("start countdown bf", () => {
      if (called == false) {
        called = true
        Countdown(io, 59).then(res => {
          if (res) {
            called = false
          }
        })
      }
    })

    socket.on("start countdown bfResult", () => {
      if (called == false) {
        called = true
        Countdown(io, 7).then(res => {
          if (res) {
            called = false
            Match.isOver(io, false)
          }
        })
      }
    })
  })
};