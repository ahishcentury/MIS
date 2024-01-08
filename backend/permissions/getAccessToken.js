const { signAccessToken } = require("../controller/authentication/authUsers");
const UserModel = require("../schemas/user");
const adminUsers = require("../helper/adminUsers")
const backOfficeUser = require("../helper/backOfficeUser")
module.exports = async function (req, res, next) {
    try {
        let userType = "";
        let user = UserModel();
        let userData = await user.findOne({ email: req.body.email, softDeleted: false });
        if (!userData) {
            console.log("User Not Found");
            return res.status(404).end();
        }
        else {
            console.log("I m called")
            if (adminUsers.includes(req.body.email)) {
                //MISA mis admin user
                userType = "MISA";
            }
            else if (backOfficeUser.includes(req.body.email)) {
                //MISB mis backoffice user
                userType = "MISB";
            }
            const token = await signAccessToken({
                email: req.body.email,
                userType: userType
            });
            return res.json({ token: token, userType: userType });
        }
    } catch (e) {
        console.log(e.message, "Look this is Me");
    }
};
