const PERMISSIONS = require("../../permissions/moduleFieldPermissions");
const UserRole = require("../../schemas/userRole");
module.exports = async function (req, res) {
    let {
        roleName,
        desc
    } = req.body;
    let roleExisted = await UserRole.findOne({ roleName: roleName });
    console.log(roleExisted)
    if (!roleExisted) {
        let modulePermission = PERMISSIONS;
        new UserRole({
            roleName: roleName,
            reportsTo: "Mumshad",
            desc: desc,
            perms: modulePermission
        }).save().then((result) => {
            console.log(res);
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })
    }
    else {
        return res.status(409).end();
    }
};
