const adminUsers = require("../../helper/adminUsers");
const UserRole = require("../../schemas/userRole");
module.exports = async function (req, res) {
    const { roleName } = req.body;
    const { email, userType } = req.payload;
    if (!adminUsers.includes(email)) {
        return res.status(401).end();
    }
    const data = await UserRole.updateOne({ roleName: roleName }, { $set: { softDeleted: true } });
    if (data) {
        return res.json("role deleted Successfully");
    }
    return res.json("ERROR");
}