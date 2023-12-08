const Users = require("../../schemas/user");
const getUsers = function (req, res, err) {

    Users.aggregate([
        {
            $match: { softDeleted: false }
        },
        {
            $project: {
                _id: "$_id",
                name: {
                    $concat: ["$fname", " ", "$lname"]
                },
                accountType: "$accountType",
                email: "$email",
                password: "$password",
                role: "$role",
                phone: "$phone",
                dob: "$dob",
                handlerId: "$handlerId",
                tickets: "$tickets",
                activated: "$activated",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        }]).then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
        })
};

module.exports = getUsers;