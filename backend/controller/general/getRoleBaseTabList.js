const User = require("../../schemas/user");
const UserModule = require("../../schemas/userModules");
const UserRole = require("../../schemas/userRole");
const ObjectId = require('mongodb').ObjectId;
module.exports = async function (req, res, next) {
  try {
    const { email } = req.body;
    let userRoleData = null;
    let roleName = null;
    let userRoleModules = null;
    let allowedModuleList = [];
    let userData = await User.find({ email: email });
    console.log(userData.length)
    if (userData.length != 0) {
      userRoleData = await UserRole.find({ "_id": new ObjectId(userData[0].role) });
      roleName = userRoleData[0].roleName;
    }

    if (roleName != null) {
      userRoleModules = await UserModule.find({});
    }

    Object.keys(userRoleModules).forEach(function (key) {
      var val = userRoleModules[key];
      allowedModuleList.push({ [val["moduleName"]]: [val["permission"]["roles"][roleName][0], val["permission"]["roles"][roleName][1], val["permission"]["roles"][roleName][2]] })
    });

    res.json({ allowedModuleList });
  } catch (e) {
    res.status(500).end();
  }
};
