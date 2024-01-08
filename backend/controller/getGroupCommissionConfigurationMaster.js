const groupCommissionConfigurationModel = require("../schemas/groupCommissionConfigurationMaster");

module.exports = function (req, res) {
    try {
        let { groupName } = req.params;
        let groupCommissionConfiguration = groupCommissionConfigurationModel();
        groupName = "real\\" + groupName;
        groupCommissionConfiguration.find({ groupName: groupName }).then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err.message);
            res.status(500).end();
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).end();
    }

}