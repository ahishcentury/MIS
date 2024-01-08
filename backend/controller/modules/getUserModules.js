const UserModulesModel = require("../../schemas/userModules");

module.exports = async function (req, res) {
    let UserModules = UserModulesModel();
    const data = await UserModules.find({});
    if (data) {
        return res.json(data);
    }
    return res.json("ERROR");
}