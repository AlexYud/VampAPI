class HomeController {

    async index(req, res) {
        res.send("Home page");
    }

    async validate(req, res) {
        res.send("Ok!");
    }

}

module.exports = new HomeController();
