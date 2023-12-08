const { default: mongoose } = require('mongoose');
const User = require('../../schemas/user');
const validator = require("validator");


module.exports = async function (req, res, next) {
    let result = null;
    try {
        const { fname, lname, email, phone, role, dob } = req.body;

        const isRegistered = await User.findOne({ $or: [{ email }, { phone }] });

        if (isRegistered)
            return res.status(409).end();

        if (!validator.isEmail(email) || !validator.isAlpha(fname) || !validator.isAlpha(lname))
            return res.status(400).end();
        result = await new User({
            fname, lname, email, phone, dob, role: mongoose.Types.ObjectId(role), password: phone
        }).save();
        if (result) {
            res.json({
                _id: result._id,
                name: result.fname + " " + result.lname,
                email: result.email,
                activated: result.activated,
                phone: result.phone,
                role: result.role,
                phone: result.phone,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            });
        } else {
            res.status(500).end();
        }
    } catch (e) {
        console.log(e.message);
        return res.status(500).end();
    }
}