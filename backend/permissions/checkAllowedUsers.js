const MISAdmin = require("../helper/adminUsers");
const { signAccessToken } = require("../controller/authentication/authUsers");
const JSEncrypt = require("nodejs-jsencrypt").default;
const decrypt = new JSEncrypt();
const { PRIVATE_KEY } = require("../helper/keys");
decrypt.setPrivateKey(PRIVATE_KEY);

module.exports = async function (req, res, next) {
    try {
        const decrypted = decrypt.decrypt(req.body.payload);

        // const { userType, userEmail } = JSON.parse(decrypted);
        const { userType, userEmail } = req.body;

        if (userType === "MISA") {
            if (MISAdmin.includes(userEmail)) {
                const token = await signAccessToken({
                    userType: userType
                });
                console.log(token);
                return res.json(token);//previously it is status Code
            } else {
                return res.status(401).end();
            }
        }
        else {
            return res.json("User Type is not matched");
        }
    } catch (e) {
        return res.status(500).end();
    }
};
