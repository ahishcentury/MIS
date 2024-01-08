const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Users = Schema(
    {
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        dob: { type: String, required: true },
        accountType: { type: String, required: true },
        userStatus: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        role: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = () => { let exportedModel = mongoose.connection.model('users', Users); return exportedModel; };