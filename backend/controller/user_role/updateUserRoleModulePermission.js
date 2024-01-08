const UserModuleModel = require("../../schemas/userModules");
const UserRoleModel = require("../../schemas/userRole");
module.exports = async function (req, res) {
    try {
        let modules = Object.keys(req.body["data"]);
        let roleName = req.body["data"]["roleName"];
        let UserModule = UserModuleModel()
        let UserRole = UserRoleModel()
        for (let i = 0; i < modules.length; ++i) {
            if (modules[i] == "roleName")
                continue
            let data = await UserModule.updateOne({ moduleName: modules[i] }, { $set: { ["permission.roles." + roleName]: req.body["data"][modules[i]], updatedAt: new Date().toISOString() } });
            if (data.acknowledged) {
                let userRole = await UserRole.updateOne({ _id: req.body["_id"] }, { $set: { updatedAt: new Date().toISOString() } });
                if (userRole) {
                    console.log(userRole);
                }
            }
            else {
                console.log("Data not updated");
            }
        }
    }
    catch (e) {
        console.log(e.message);
    }

};
