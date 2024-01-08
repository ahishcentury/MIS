const UserModel = require("../../schemas/user");
const UserModuleModel = require("../../schemas/userModules");
const UserRoleModel = require("../../schemas/userRole");
const ObjectId = require('mongodb').ObjectId;
module.exports = async function (req, res, next) {
  try {
    let UserModule = UserModuleModel();
    let UserRole = UserRoleModel();
    let User = UserModel();
    const { email } = req.body;
    let userRoleData = null;
    let roleName = null;
    let userRoleModules = null;
    let allowedModuleList = [];
    let userData = await User.find({ email: email });
    console.log("I m in this module");
    console.log(userData.length)
    if (userData.length != 0) {
      userRoleData = await UserRole.find({ "_id": new ObjectId(userData[0].role) });
      roleName = userRoleData[0].roleName;
    }

    if (roleName != null) {
      userRoleModules = await UserModule.find({});
    }
    console.log(roleName, "Role Name");
    Object.keys(userRoleModules).map(function (key) {
      var val = userRoleModules[key];

      val = (JSON.stringify(val))
      val = (JSON.parse(val))
      let arr = Object.keys(val)
      if (arr.includes("permission")) {
        if (val["permission"]["roles"][roleName] != undefined)
          allowedModuleList.push({ [val["moduleName"]]: [val["permission"]["roles"][roleName][0], val["permission"]["roles"][roleName][1], val["permission"]["roles"][roleName][2]] })
      }
    });
    return res.json({ allowedModuleList });
  } catch (e) {
    res.status(500).end();
  }
};
