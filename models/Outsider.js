var knex = require("../database/connection");

class Outsider {

  id = 1
  name = 'Forasteiro'
  imgName = 'FORASTEIRO'
  imgAlt = 'Imagem Forasteiro'
  description = 'Pode escolher qualquer jogador para morrer quando você morrer.'
  username = undefined;
  socketId = "";
  selected = "";
  votes = 0;
  alive = true;
  killed = false;

  kill(log, users, Vampire, Witch, Villager, Medic) {
    return new Promise((resolve, reject) => {
      this.killed = true
      var player = users.filter(u => u.id == this.selected)
      switch (player[0].character) {
        case 0:
          Vampire.alive = false
          log.push(`${this.username} (${this.name}) escolheu ${player[0].username} (${Vampire.name})`)
          resolve(true)
          break
        case 2:
          Witch.alive = false
          log.push(`${this.username} (${this.name}) escolheu ${player[0].username} (${Witch.name})`)
          resolve(true)
          break
        case 3:
          Villager.alive = false
          log.push(`${this.username} (${this.name}) escolheu ${player[0].username} (${Villager.name})`)
          resolve(true)
          break
        case 4:
          Medic.alive = false
          log.push(`${this.username} (${this.name}) escolheu ${player[0].username} (${Medic.name})`)
          resolve(true)
          break
        default:
          console.log('erro forasteiro kill switch')
          reject(false)
      }
    })
  }
}

module.exports = new Outsider()