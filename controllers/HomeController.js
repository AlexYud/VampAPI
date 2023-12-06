class HomeController {

    async index(req, res) {
        res.send("Welcome");
    }

}

module.exports = new HomeController();
