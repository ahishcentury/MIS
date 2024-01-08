const adminUsers = require("../../helper/adminUsers");
const UserRoleModel = require("../../schemas/userRole");
module.exports = async function (req, res) {
    const { roleName } = req.body;
    const { email, userType } = req.payload;
    let UserRole = UserRoleModel();
    if (!adminUsers.includes(email)) {
        return res.status(401).end();
    }
    const data = await UserRole.updateOne({ roleName: roleName }, { $set: { softDeleted: true } });
    if (data) {
        return res.json("role deleted Successfully");
    }
    return res.json("ERROR");
}