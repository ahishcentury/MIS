const symbolModel = require("../schemas/symbolMaster");
const userMasterModel = require("../schemas/userMaster");
const UserRoleModel = require("../schemas/userRole");
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
    let symbolSchema = symbolModel();
    let userMaster = userMasterModel();
    let UserRole = UserRoleModel();
    let userData = await userMaster.findOne({ email: email });
    if (userData) {
        roleName = userData.role;
    }
    if (roleName != null) {
        userRoleModulesPermission = await UserRole.findById(roleName);
    }
    let symbolPermissions = userRoleModulesPermission.perms[0]["Symbols"]
    let temp = { _id: 1 };
    Object.keys(symbolPermissions).forEach(function (key) {
        if (symbolPermissions[key][1] === 1) {
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