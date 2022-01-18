var knex = require("../database/connection");

class Villager {

  id = 3
  name = 'Aldeão'
  imgName = 'ALDEAO'
  imgAlt = 'Imagem Aldeão'
  description = 'Você é um aldeão.'
  username = undefined;
  socketId = "";
  selected = "";
  votes = 0;
  alive = true;

  vote() {
    
  }
}

module.exports = new Villager()