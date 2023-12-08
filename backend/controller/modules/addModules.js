const MODULEPERMISSIONS = require("../../permissions/modulePermissions");
const UserModules = require("../../schemas/userModules");
module.exports = async function (req, res) {

    let modulePermission = MODULEPERMISSIONS;
    console.log(modulePermission);
    await UserModules.deleteMany({});
    let modules = await UserModules.insertMany(modulePermission);
    if (modules) {
        res.json(modules);
    }
    else {
        res.json("Modules not added");
    }
};
