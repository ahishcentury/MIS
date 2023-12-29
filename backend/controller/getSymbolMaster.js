const symbolSchema = require("../schemas/symbolMaster");
const userMaster = require("../schemas/userMaster");
const UserRole = require("../schemas/userRole");
module.exports = async function (req, res) {
    // const {calledBy} = req.body;
    // const data = await symbolSchema.aggregate([
    //     {
    //         $project: {
    //             k: "$symbolName",
    //             v: "$$ROOT",
    //             _id: 0
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             symbolMaster: {
    //                 $push: "$$ROOT"
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             symbolMaster: {
    //                 $arrayToObject: "$symbolMaster"
    //             }
    //         }
    //         // $project: {
    //         //     symbolMaster: {
    //         //         $cond: {
    //         //             if: {
    //         //                 $eq: [calledBy, "symbolMaster"]
    //         //             },
    //         //             then: "$symbolMaster",
    //         //             else: { $arrayToObject: "$symbolMaster" }
    //         //         }
    //         //     }
    //         // }
    //     }
    // ]);
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
    let securityPermissions = userRoleModulesPermission.perms[0]["Securities"]
    console.log("Securities", securityPermissions);
    let temp = { _id: 1 };
    Object.keys(securityPermissions).forEach(function (key) {
        if (securityPermissions[key][1] === 1) {
            temp[key.toString()] = 1;
        }
    });
    let symbolData = await symbolSchema.aggregate([
        {
            $project: temp
        }
    ]);
    console.log(symbolData);
    res.json({ symbolData: symbolData, allowedFields: temp });
}