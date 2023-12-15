const UserRole = require("../../schemas/userRole");

module.exports = async function (req, res) {
    const { roleName } = req.body;
    // const { email, userType } = req.payload;
    // if(email){
    // userType is not MISA return 401
    // }
    // console.log("This is the Email Check", email);
    const data = await UserRole.deleteOne({ roleName: roleName });
    if (data) {
        return res.json("role deleted Successfully");
    }
    return res.json("ERROR");
}