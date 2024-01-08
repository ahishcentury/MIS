const UserRoleModel = require("../../schemas/userRole");

module.exports = async function (req, res) {
    let UserRole = UserRoleModel();
    UserRole.aggregate([
        {
            $match: { softDeleted: false }
        },
        {
            $project: {
                _id: "$_id",
                roleName: "$roleName",
                reportTo: "$reportTo",
                desc: "$desc",
                perms: "$perms",
                removable: "$removable",
                removable: "$removable",
                removable: "$removable",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        }]).then((result) => {
            return res.json(result);
        }).catch((err) => {
            console.log(err);
        })
}