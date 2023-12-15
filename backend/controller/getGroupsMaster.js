const groupSchema = require("../schemas/groupMaster");
const userMaster = require("../schemas/userMaster");
const userModules = require("../schemas/userModules");
const UserRole = require("../schemas/userRole");
const getGroupsMaster = async (req, res) => {
    try {
        const { email, userType } = req.payload;
        let roleName = null;
        console.log(email, "My Mail")
        let userRoleModulesPermission = null;
        let userData = await userMaster.findOne({ email: email });
        if (userData) {
            roleName = userData.role;
        }
        console.log(roleName, "Role Name")
        if (roleName != null) {
            userRoleModulesPermission = await UserRole.findById(roleName);
        }
        let feeGroupPermissions = userRoleModulesPermission.perms[0]["Fee Groups"]
        console.log("feeGroupPermissions", feeGroupPermissions);
        let temp = { _id: 1 };
        Object.keys(feeGroupPermissions).forEach(function (key) {
            if (feeGroupPermissions[key][0] === 1) {
                temp[key.toString()] = 1;
            }
        });
        let groupData = await groupSchema.aggregate([
            {
                $project: temp
            }
        ]);
        console.log(groupData);
        res.json({ groupData, allowedFields: temp });



        // const groups = await groupSchema.find({});
        // if (res.statusCode == 200) {
        //     res.json(groups);
        // }
        // else {
        //     res.status(500).end();
        // }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = getGroupsMaster;

// if (userData.length != 0) {
//     userRoleData = await UserRole.find({ "_id": new ObjectId(userData[0].role) });
//     roleName = userRoleData[0].roleName;
//   }

//   if (roleName != null) {
//     userRoleModules = await UserModule.find({});
//   }

//   Object.keys(userRoleModules).forEach(function (key) {
//     var val = userRoleModules[key];
//     allowedModuleList.push({ [val["moduleName"]]: [val["permission"]["roles"][roleName][0], val["permission"]["roles"][roleName][1], val["permission"]["roles"][roleName][2]] })
//   });

//   res.json({ allowedModuleList });