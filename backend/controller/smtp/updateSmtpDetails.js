const fs = require('fs');
let path = require("path");
module.exports = async function (req, res, next) {
    const { host, port, username, password, name } = req.body;
    let data = { host: host, port: port, username: username, password: password, name: name };
    try {
        let requiredObj = JSON.stringify(data);
        fs.writeFileSync(path.join(__dirname, '../../helper/smtpConfig.json'), requiredObj);
        res.send("data : " + requiredObj);
    } catch (e) {
        console.log("ERROR: ", e.message);
    }
}