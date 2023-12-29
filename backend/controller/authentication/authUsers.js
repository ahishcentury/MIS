const JWT = require("jsonwebtoken");
const secret = "TUlTU2VjcmV0";

module.exports = {
    signAccessToken: (obj) => {
        return new Promise((resolve, reject) => {
            const payload = {
                userType: obj.userType,
                email: obj.email,
            };
            const options = {
                issuer: "century.mis.ae",
                audience: obj.userType.toString(),
                expiresIn: "60m",
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) reject(err);
                resolve(token);
            });
        });
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                userType: "nuser"
            };
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "60m",
                issuer: "century.mis.ae",
                audience: userId,
            };

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) reject(err);
                resolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) return res.status(401).end("Unauthorized");
            JWT.verify(token, secret, (err, payload) => {
                console.log(payload);
                if (err) {
                    console.log(err.message);
                    return res.status(401).end("Unauthorized");
                }
                req.payload = payload;
                next();
                // res.status(200).end();
            });
        }
        catch (e) {
            console.log(e.message);
            res.status(500).end();
        }
    }
}