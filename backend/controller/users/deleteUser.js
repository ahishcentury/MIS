const UserModel = require("../../schemas/user");

module.exports = async function (req, res) {
    try {
        const { _id } = req.body;
        let User = UserModel();
        const data = await User.updateOne({ _id: _id }, { $set: { softDeleted: true } });
        if (data) {
            return res.json("User deleted Successfully");
        }

        return res.json("ERROR");
    }
    catch (e) {
        console.log(e.message);
    }
}