const groupSchema = require("../schemas/groupMaster");
const userMaster = require("../schemas/userMaster");
const userModules = require("../schemas/userModules");
const UserRole = require("../schemas/userRole");
const getGroupsMaster = async (req, res) => {
    try {
        const { email, userType } = req.payload;
        let roleName = null;
        let userRoleModulesPermission = null;
        let userData = await userMaster.findOne({ email: email });
        if (userData) {
            roleName = userData.role;
        }
        if (roleName != null) {
            userRoleModulesPermission = await UserRole.findById(roleName);
        }
        let feeGroupPermissions = userRoleModulesPermission.perms[0]["Fee Groups"]
        let temp = { _id: 1 };
        Object.keys(feeGroupPermissions).forEach(function (key) {
            if (feeGroupPermissions[key][1] === 1) {
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
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = getGroupsMaster;