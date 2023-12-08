const UserRole = require("../../schemas/userRole");

module.exports = async function (req, res) {
    const { roleName } = req.body;
    console.log(roleName)
    const data = await UserRole.deleteOne({ roleName: roleName });
    if (data) {
        return res.json("role deleted Successfully");
    }
    return res.json("ERROR");
}