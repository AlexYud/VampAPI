class Validate {
  validate(name) {
    if (name == '' || name == ' ') {
      return false
    } else {
      return true
    }
  }
}

module.exports = new Validate()