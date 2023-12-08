const fs = require('fs');
let path = require("path");
module.exports = async function (req, res, next) {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../../helper/smtpConfig.json'));
        console.log(JSON.parse(data));
        res.send(data);
    } catch (e) {
        console.log("ERROR: ", e.message);
    }
}