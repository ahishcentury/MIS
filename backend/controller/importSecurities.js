const Security = require('../schemas/security');
const jsonwebtoken = require("jsonwebtoken");


module.exports = function (req, res) {
    try {

        console.log(req.body.securities);

        Security.insertMany(req.body.securities).then(docs => {
            console.log(docs);
            res.json(docs);

        }).catch(err => {
            console.log(err.message);
            return res.status(500).end();
        })


    } catch (e) {
        console.log(e.message);
        return res.status(500).end();
    }
}