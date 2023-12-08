const UserModule = require("../../schemas/userModules");
module.exports = async function (req, res) {
    let key = (Object.keys(req.body["roles"]))[0];
    let data = await UserModule.updateMany({}, { $set: { ["permission.roles." + key]: [0, 0, 0] } });
    if (data) {
        res.json(data);
    }
    else {
        res.status(400).end();
    }
};
