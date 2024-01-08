const UserModuleModel = require("../../schemas/userModules");
module.exports = async function (req, res) {
    let key = (Object.keys(req.body["roles"]))[0];
    // console.log(JSON.stringify(key), "This is the Key");
    let UserModule = UserModuleModel();
    let data = await UserModule.updateMany({}, { $set: { ["permission.roles." + key]: [0, 0, 0] } });
    if (data) {
        res.json(data);
    }
    else {
        res.status(400).end();
    }
};
