const UserRoleModel = require("../../schemas/userRole");
const UserModules = require("../../schemas/userModules");
module.exports = async function (req, res) {
    console.log(req.body["data"]);
    let UserRole = UserRoleModel();
    const {
        perms,
        _id,
    } = req.body["data"];
    let data = await UserRole.updateOne({ _id: _id }, { $set: { perms: perms, updatedAt: new Date().toISOString() } });
    if (data) {
        res.json(data);
    }
    else {
        res.json("Data Not updated");
    }
};
