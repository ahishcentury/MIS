const UserRole = require("../../schemas/userRole");

module.exports = async function (req, res) {
    const data = await UserRole.find({});
    if (data) {
        return res.json(data);
    }
    return res.json("ERROR");
}