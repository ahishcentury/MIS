const groupSchema = require("../schemas/groupMaster");
const getGroups = async (req, res) => {
    try {
        const groups = await groupSchema.find({});
        if (res.statusCode == 200) {
            res.json(groups);
        }
        else {
            res.status(500).end();
        }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = getGroups;