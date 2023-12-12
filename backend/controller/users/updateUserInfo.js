const User = require('../../schemas/user');
const mongoose = require('mongoose');

module.exports = async function (req, res, next) {

    let result = null;
    try {

        let { userId, field, value } = req.body;

        if (field === "role")
            value = new mongoose.Types.ObjectId(value);
        result = await User.updateOne({ _id: userId }, { $set: { [field]: value } });

        if (result) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }


    } catch (e) {
        console.log(e.message);
        return res.status(400).end();
    }
}