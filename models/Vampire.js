var knex = require("../database/connection");

class Vampire {

  id = 0
  name = 'Vampiro'
  imgName = 'VAMPIRO_V2'
  imgAlt = 'Imagem Vampiro'
  description = 'Pode escolher qualquer jogador para matar.'
  username = undefined;
  socketId = "";
  selected = "";
  votes = 0;
  alive = true;

  kill(log, users, Outsider, Witch, Villager, Medic) {
    return new Promise((resolve, reject) => {
      var player = users.filter(u => u.id == this.selected)
      switch (player[0].character) {
        case 1:
          Outsider.alive = false
          log.push(`${this.username} (${this.name}) matou ${player[0].username} (${Outsider.name})`)
          resolve(true)
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
          console.log('erro vampiro kill switch')
          reject(false)
      }
    })
  }
}

module.exports = new Vampire()