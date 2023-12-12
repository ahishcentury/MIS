const UserModule = require("../../schemas/userModules");
const UserRole = require("../../schemas/userRole");
module.exports = async function (req, res) {
    let modules = Object.keys(req.body["data"]);
    let roleName = req.body["data"]["roleName"];
    for (let i = 0; i < modules.length; ++i) {
        if (modules[i] == "roleName")
            continue
        let data = await UserModule.updateOne({ moduleName: modules[i] }, { $set: { ["permission.roles." + roleName]: req.body["data"][modules[i]], updatedAt: new Date().toISOString() } });
        if (data.acknowledged) {
            let userRole = await UserRole.updateOne({ _id: req.body["_id"] }, { $set: { updatedAt: new Date().toISOString() } });
            if (userRole) {
                res.json(userRole);
            }
            console.log(data);
        }
        else {
            console.log("Data not updated");
        }
    }

};
