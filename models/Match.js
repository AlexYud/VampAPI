var shuffle = require('../modules/shuffle.js')
var Countdown = require('../modules/countdown')
var Vampire = require('./Vampire')
var Medic = require('./Medic')
var Witch = require('./Witch')
var Outsider = require('./Outsider')
var Villager = require('./Villager')

class Match {

  called = false
  charactersData = []
  users = []
  characters = [0, 1, 2, 3, 4]
  aliveList = []
  deadList = []
  plays = []
  votes = []
  log = []
  mostVoted = undefined
  ready = 0

  dataChar(socket) {
    if (socket == false) {
      this.charactersData = []
      this.charactersData.push(Vampire)
      this.charactersData.push(Outsider)
      this.charactersData.push(Witch)
      this.charactersData.push(Villager)
      this.charactersData.push(Medic)
    } else {
      this.charactersData = []
      this.charactersData.push(Vampire)
      this.charactersData.push(Outsider)
      this.charactersData.push(Witch)
      this.charactersData.push(Villager)
      this.charactersData.push(Medic)
      socket.emit('data characters', this.charactersData)
    }
  }

  start(io, users) {
    this.aliveList = []
    this.deadList = []
    this.plays = []
    this.votes = []
    this.log = []
    this.mostVoted = undefined
    this.ready = 0

    this.dataChar(false)
    this.charactersData.forEach(char => {
      if (char.id == 2) {
        char.username = undefined;
        char.socketId = "";
        char.selected = "";
        char.votes = 0;
        char.alive = true;
        char.killPot = true;
        char.savePot = true;
      } else {
        char.username = undefined;
        char.socketId = "";
        char.selected = "";
        char.votes = 0;
        char.alive = true;
      }

    })

    this.users = users
    this.shufflePlayers(io)
  }

  shufflePlayers(io) {
    let i = 0
    this.characters = shuffle(this.characters)
    this.users.forEach(user => {
      user.character = this.characters[i]
      i++
    });
    this.loadDataUsers()
    io.emit("night")
    this.log.push('NOITE')
  }

  loadDataUsers() {
    this.users.forEach(user => {
      this.charactersData.forEach(char => {
        if (char.id == user.character) {
          char.username = user.username
          char.socketId = user.id
          this.aliveList.push({ username: char.username, id: char.socketId, votes: char.votes })
        }
      })
    })
  }

  night(io, socket) {

    this.plays = []
    this.ready = 0

    this.users.forEach(user => {
      if (user.id == socket.id) {
        this.charactersData.forEach(char => {
          if (char.id == user.character) {
            if (char.id == 2) {
              var players = this.aliveList.filter((p) => p.id != socket.id)
              var shuffledPlayers = players.sort(function (a, b) { return Math.random() - 0.5; })
              var data = {
                char_id: char.id,
                name: char.name,
                imgName: char.imgName,
                imgAlt: char.imgAlt,
                description: char.description,
                players: shuffledPlayers,
                preSelected: shuffledPlayers[0].id,
                isAlive: char.alive,
                savePot: char.savePot,
                killPot: char.killPot
              }
              socket.emit("data night", data)
            } else {
              var players = this.aliveList.filter((p) => p.id != socket.id)
              var shuffledPlayers = players.sort(function (a, b) { return Math.random() - 0.5; })
              var data = {
                char_id: char.id,
                name: char.name,
                imgName: char.imgName,
                imgAlt: char.imgAlt,
                description: char.description,
                players: shuffledPlayers,
                preSelected: shuffledPlayers[0].id,
                isAlive: char.alive,
              }
              socket.emit("data night", data)
            }
          }
        })
      }
    })


    socket.on("end night", data => {

      if (this.plays.every(play => play.char_id != data.char_id) && data.isAlive == true) {
        this.plays.push(data)
        this.ready++
      }

      if (this.ready == this.aliveList.length) {
        this.ready = 0
        this.processNight(io)
      }

    })
  }

  processNight(io) {

    io.emit("loading")

    var sortedPlays = this.plays.sort(function (a, b) {
      return parseInt(a.char_id) - parseInt(b.char_id)
    })

    Outsider.killed = false

    sortedPlays.forEach(play => {
      switch (play.char_id) {

        case 0:
          if (!play.skip) {
            Vampire.selected = play.selected
            Vampire.kill(this.log, this.users, Outsider, Witch, Villager, Medic).then(res => {
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.log.push(`${Vampire.username} (${Vampire.name}) pulou a noite`)
          }
          break
        case 1:
          if (!play.skip) {
            Outsider.selected = play.selected
            if (!Outsider.alive) {
              Outsider.kill(this.log, this.users, Vampire, Witch, Villager, Medic).then(res => {
              }).catch(err => {
                console.log(err)
              })
            }
          } else {
            this.log.push(`${Outsider.username} (${Outsider.name}) pulou a noite`)
          }
          break
        case 2:
          if (!play.skip) {
            if (play.potion == undefined) {
              this.log.push(`${Witch.username} (${Witch.name}) pulou a noite`)
            } else {
              Witch.selected = play.selected
              if (play.potion == 'kill') {
                Witch.kill(this.log, this.users, Vampire, Outsider, Witch, Villager, Medic).then(res => {
                }).catch(err => {
                  console.log(err)
                })
              } else if (play.potion == 'save') {
                Witch.save(this.log, this.users, Vampire, Outsider, Witch, Villager, Medic).then(res => {
                }).catch(err => {
                  console.log(err)
                })
              } else {
                console.log("erro case 2 sortedPlays switch")
              }
            }
          } else {
            this.log.push(`${Witch.username} (${Witch.name}) pulou a noite`)
          }
          break
        case 3:
          if (!play.skip) {
            Villager.selected = play.selected
          } else {
            this.log.push(`${Villager.username} (${Villager.name}) pulou a noite`)
          }
          break
        case 4:
          if (!play.skip) {
            Medic.selected = play.selected
            Medic.save(this.log, this.users, Vampire, Outsider, Witch, Villager, Medic).then(res => {
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.log.push(`${Medic.username} (${Medic.name}) pulou a noite`)
          }
          break
        default:
          console.log('erro sortedPlays switch')
      }
    })
  }

  isOver(io, morning) {
    this.ready = 0
    this.deadList = []

    if (Vampire.alive) {
      var dead = 0
      var deadNow = []

      this.aliveList.forEach(player => {
        this.charactersData.forEach(char => {
          if (char.socketId == player.id && char.alive == false) {
            dead++
            deadNow.push({ username: char.username, id: char.socketId })
          }
        })
      })

      this.aliveList = []

      this.charactersData.forEach(char => {
        if (char.alive) {
          this.aliveList.push({ username: char.username, id: char.socketId, votes: char.votes })
        } else {
          this.deadList.push({ username: char.username, id: char.socketId })
        }
      })

      if (this.deadList.length >= (this.charactersData.length - 2)) {
        io.emit('end')
        this.end(io, true, this.log)
      } else {
        if (morning) {
          io.emit('morning')
          this.morning(io, dead, deadNow)
        } else {
          this.log.push('NOITE')
          io.emit("night")
        }
      }
    } else {
      io.emit('end')
      this.end(io, false, this.log)
    }
  }

  morning(io, dead, deadList) {
    io.emit('data morning', { dead, deadList })
    Countdown(io, 7).then(res => {
      if (res) {
        this.ready = 0
        this.votes = []
        io.emit("bonfire")
      }
    }).catch(erro => {
      console.log(erro)
    })
  }

  bonfire(io, socket) {
    var players = this.aliveList.filter((p) => p.id != socket.id)
    this.charactersData.forEach(char => {
      if (char.socketId == socket.id) {
        var data = {
          id: socket.id,
          username: char.username,
          aliveList: players,
          isAlive: char.alive,
        }
        socket.emit('data bonfire', data)
      }
    })

    socket.on("end bonfire", data => {

      if (this.votes.every(vote => vote.id != data.id) && data.isAlive == true) {
        this.votes.push(data)
        this.ready++
      }

      if (this.ready == this.aliveList.length) {
        this.ready = 0
        this.processBonfire(io)
      }
    })
  }

  processBonfire(io) {

    io.emit('wait')

    var skipVotes = 0

    this.log.push("FOGUEIRA")
    this.votes.forEach(vote => {
      var player = this.aliveList.filter(p => p.id == vote.selected)
      if (!vote.skip) {
        player[0].votes++
        this.log.push(`${vote.username} votou em ${player[0].username}`)
      } else {
        skipVotes++
        this.log.push(`${vote.username} pulou o voto`)
      }
    })

    var allVotes = []

    this.aliveList.forEach(player => {
      allVotes.push(player.votes)
    })

    allVotes.sort()

    this.log.push('RESULTADO')

    if (allVotes[this.aliveList.length - 1] <= skipVotes) {
      this.log.push(`A votação foi pulada`)
    } else {
      if (allVotes[this.aliveList.length - 1] != allVotes[this.aliveList.length - 2]) {
        var player = this.aliveList.filter(p => p.votes == allVotes[this.aliveList.length - 1])
        this.mostVoted = player[0]
        this.charactersData.forEach(char => {
          if (char.socketId == player[0].id) {
            char.alive = false
            this.log.push(`${player[0].username} morreu na Fogueira`)
          }
        })
      } else {
        this.log.push(`A votação empatou`)
      }
    }
  }

  bonfireResult(io) {

    io.emit("bonfireResult")

    if (this.mostVoted != undefined) {
      io.emit("data bfResult", { dead: 1, deadList: this.mostVoted })
    } else {
      io.emit("data bfResult", { dead: 0, deadList: this.mostVoted })
    }
  }

  end(io, vampWin, log) {
    if (vampWin) {

      io.emit('data end', { winner: 'VAMPIRO', log: log, vamp: Vampire.username })
    } else {

      io.emit('data end', { winner: 'VILA', log: log, vamp: Vampire.username })
    }
  }
}

module.exports = new Match()