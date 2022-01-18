var knex = require("../database/connection");

class Witch {

  id = 2
  name = 'Bruxa'
  imgName = 'BRUXA'
  imgAlt = 'Imagem Bruxa'
  description = 'Pode escolher entre matar ou salvar um jogador.'
  username = undefined;
  socketId = "";
  selected = "";
  votes = 0;
  alive = true;
  savePot = true;
  killPot = true;


  kill(log, users, Vampire, Outsider, Witch, Villager, Medic) {
    return new Promise((resolve, reject) => {
      this.killPot = false
      var player = users.filter(u => u.id == this.selected)
      switch (player[0].character) {
        case 0:
          Vampire.alive = false
          log.push(`${this.username} (${this.name}) matou ${player[0].username} (${Vampire.name})`)
          resolve(true)
          break
        case 1:
          if (!Outsider.killed) {
            Outsider.alive = false
            log.push(`${this.username} (${this.name}) matou ${player[0].username} (${Outsider.name})`)
            Outsider.kill(log, users, Vampire, Witch, Villager, Medic).then(res => {
              if (res) {
                resolve(true)
              }
            }).catch(err => {
              console.log(err)
              reject(false)
            })
          }
          break
        case 2:
          Witch.alive = false
          log.push(`${this.username} (${this.name}) matou ${player[0].username} (${Witch.name})`)
          resolve(true)
          break
        case 3:
          Villager.alive = false
          log.push(`${this.username} (${this.name}) matou ${player[0].username} (${Villager.name})`)
          resolve(true)
          break
        case 4:
          Medic.alive = false
          log.push(`${this.username} (${this.name}) matou ${player[0].username} (${Medic.name})`)
          resolve(true)
          break
        default:
          console.log('erro bruxa kill switch')
          reject(false)
      }
    })
  }

  save(log, users, Vampire, Outsider, Witch, Villager, Medic) {
    return new Promise((resolve, reject) => {
      this.savePot = false
      var player = users.filter(u => u.id == this.selected)
      switch (player[0].character) {
        case 0:
          Vampire.alive = true
          log.push(`${this.username} (${this.name}) salvou ${player[0].username} (${Vampire.name})`)
          resolve(true)
          break
        case 1:
          Outsider.alive = true
          log.push(`${this.username} (${this.name}) salvou ${player[0].username} (${Outsider.name})`)
          resolve(true)
          break
        case 2:
          Witch.alive = true
          log.push(`${this.username} (${this.name}) salvou ${player[0].username} (${Witch.name})`)
          resolve(true)
          break
        case 3:
          Villager.alive = true
          log.push(`${this.username} (${this.name}) salvou ${player[0].username} (${Villager.name})`)
          resolve(true)
          break
        case 4:
          Medic.alive = true
          log.push(`${this.username} (${this.name}) salvou ${player[0].username} (${Medic.name})`)
          resolve(true)
          break
        default:
          console.log('erro bruxa save switch')
          reject(false)
      }
    })
  }
}

module.exports = new Witch()