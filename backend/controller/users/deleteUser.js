const User = require("../../schemas/user");

module.exports = async function (req, res) {
    const { _id } = req.body;
    const data = await User.updateOne({ _id: _id }, { $set: { softDeleted: true } });
    if (data) {
        return res.json("User deleted Successfully");
    }

    return res.json("ERROR");
}