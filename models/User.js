var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {

  async findAll() {
    try {
      var result = await knex.select(['id', 'email', 'name', 'role']).table("users");
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async findById(id) {
    try {
      var result = await knex.select(['id', 'email', 'name', 'role']).table("users").where({ id: id });
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async findByEmail(email) {
    try {
      var result = await knex.select(['id', 'email', 'password', 'name', 'role']).table("users").where({ email: email });

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async new(email, password, name) {
    try {
      var hash = await bcrypt.hash(password, 10);
      await knex.insert({ email, password: hash, name, role: 0 }).table("users");
    } catch (error) {
      console.log(error);
    }
  }

  async findEmail(email) {
    try {
      var result = await knex.select("*").from("users").where({ email: email });
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async update(id, email, name, role) {

    var user = await this.findById(id);

    if (user != undefined) {

      var editUser = {};

      if (email != undefined) {
        if (email != user.email) {
          var result = await this.findEmail(email);
          if (!result) {
            editUser.email = email;
          } else {
            return { status: false, err: "O email já está cadastrado!" }
          }
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await knex.update(editUser).where({ id: id }).table("users");
        return { status: true }
      } catch (error) {
        return { status: false, err: error }
      }

    } else {
      return { status: false, err: "O usuário não existe!" }
    }
  }

  async delete(id) {
    var user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table("users");
        return { status: true }
      } catch (error) {
        return { status: false, err: error }
      }
    } else {
      return { status: false, err: "O usuário não existe!" }
    }
  }

  async changePassword(newPassword, id, token) {
    try {
      var hash = await bcrypt.hash(newPassword, 10);
      await knex.update({ password: hash }).where({ id: id }).table("users");
      await PasswordToken.setUsed(token);
      return { status: true }
    } catch (error) {
      return { status: false, err: error }
    }
  }

}

module.exports = new User();