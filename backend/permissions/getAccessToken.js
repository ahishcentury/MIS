const { signAccessToken } = require("../controller/authentication/authUsers");
module.exports = async function (req, res, next) {
    try {
        const token = await signAccessToken({
            userType: userType
        });
        console.log(token);
        return res.json("token");
    } catch (e) {
        onsole.log(e.message);
    }
};
