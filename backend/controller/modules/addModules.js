const MODULEPERMISSIONS = require("../../permissions/modulePermissions");
const userModulesModel = require("../../schemas/userModules");
module.exports = async function (req, res) {

    let modulePermission = MODULEPERMISSIONS;
    let newArray = [];
    let UserModules = userModulesModel();
    for (let i = 0; i < modulePermission.length; ++i) {
        let existedModules = await userModules.find({ moduleName: modulePermission[i].moduleName })
        if (existedModules.length != 0) { }
        else {
            newArray.push(modulePermission[i]);
        }
    }
    let modules = await UserModules.insertMany(newArray);
    if (modules) {
        res.json(modules);
    }
    else {
        res.json("Modules not added");
    }
};
