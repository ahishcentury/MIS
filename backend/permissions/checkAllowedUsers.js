const MISAdmin = require("../helper/adminUsers");
const MISBackOffice = require("../helper/backOfficeUser");
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
                return res.status(200).end();
            } else {
                return res.status(401).end();
            }
        }
        else if (userType === "MISB") {
            if (MISBackOffice.includes(userEmail)) {
                return res.status(200).end();
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
