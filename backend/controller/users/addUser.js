const UsersModel = require("../../schemas/userMaster");
const bcrypt = require("bcrypt");
module.exports = async function (req, res) {
    console.log(req.body);
    let Users = UsersModel();
    let {
        fname,
        lname,
        dob,
        accountType,
        userStatus,
        email,
        username,
        password,
        phone,
        address,
        role
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    password = encryptedPassword;
    new Users({
        fname,
        lname,
        dob,
        accountType,
        userStatus,
        email,
        username,
        password,
        phone,
        address,
        role
    }).save().then((result) => {
        console.log(res);
        res.send(result);
    }).catch((err) => {
        console.log(err);
    })
};
