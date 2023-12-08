const UserModules = require("../../schemas/userModules");

module.exports = async function (req, res) {
    const data = await UserModules.find({});
    if (data) {
        return res.json(data);
    }
    return res.json("ERROR");
}