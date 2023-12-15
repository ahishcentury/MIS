const { signAccessToken } = require("../controller/authentication/authUsers");
const user = require("../schemas/user");
const adminUsers = require("../helper/adminUsers")
const backOfficeUser = require("../helper/backOfficeUser")
module.exports = async function (req, res, next) {
    try {
        let userType = "";
        let userData = await user.findOne({ email: req.body.email });
        if (!userData) {
            return res.status(404).end();
        }
        if (adminUsers.includes(req.body.email)) {
            userType = "MISA";
        }
        else if (backOfficeUser.includes(req.body.email)) {
            userType = "MISB";
        }
        const token = await signAccessToken({
            email: req.body.email,
            userType: userType
        });
        return res.json({ token: token, userType: userType });
    } catch (e) {
        onsole.log(e.message);
    }
};
