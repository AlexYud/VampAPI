var knex = require("../database/connection");

class Medic {

  id = 4
  name = 'Médico'
  imgName = 'MEDICO'
  imgAlt = 'Imagem Medico'
  description = 'Pode salvar qualquer jogador a cada noite.'
  username = undefined;
  socketId = "";
  selected = "";
  votes = 0;
  alive = true;

  save(log, users, Vampire, Outsider, Witch, Villager, Medic) {
    return new Promise((resolve, reject) => {
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
          console.log('erro medic save switch')
          reject(false)
      }
    })
  }
}

module.exports = new Medic()