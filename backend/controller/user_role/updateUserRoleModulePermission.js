const UserModule = require("../../schemas/userModules");
module.exports = async function (req, res) {
    let modules = Object.keys(req.body["data"]);
    console.log(req.body["data"], "req.body[data]")
    let roleName = req.body["data"]["roleName"];
    for (let i = 0; i < modules.length; ++i) {
        if (modules[i] == "roleName")
            continue
        let data = await UserModule.updateOne({ moduleName: modules[i] }, { $set: { ["permission.roles." + roleName]: req.body["data"][modules[i]] } });
        if (data.acknowledged) {
            console.log(data);
        }
        else {
            console.log("Data not updated")
        }
    }

};
