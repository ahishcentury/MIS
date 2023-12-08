const groupSymbolConfiguration = require("../schemas/groupSymbolConfigurationMaster");
const getGroupSymbolConfiguration = async (req, res) => {
    try {
        let { groupName } = req.params;
        groupName = "real\\" + groupName;
        console.log(groupName);
        const symbolConfig = await groupSymbolConfiguration.find({ groupName: groupName });
        if (res.statusCode == 200) {
            res.json(symbolConfig);
        }
        else {
            res.status(500).end();
        }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = getGroupSymbolConfiguration;