const MISAdmin = require("../helper/adminUsers");

const JSEncrypt = require("nodejs-jsencrypt").default;
const decrypt = new JSEncrypt();
const { PRIVATE_KEY } = require("../helper/keys");
decrypt.setPrivateKey(PRIVATE_KEY);

module.exports = function (req, res, next) {
    try {
        const decrypted = decrypt.decrypt(req.body.payload);

        // const { userType, userEmail } = JSON.parse(decrypted);
        const { userType, userEmail } = req.body;
        console.log(req.body)

        if (userType === "MISA") {
            if (MISAdmin.includes(userEmail)) {
                return res.status(200).end();
            } else {
                return res.status(401).end();
            }
        }
    } catch (e) {
        return res.status(200).end();
    }
};
