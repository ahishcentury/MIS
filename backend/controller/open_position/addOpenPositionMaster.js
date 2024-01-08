const OpenPositionModel = require("../../schemas/openPosition");

const addOpenPositionMaster = async function (req, res, next) {
    try {
        const openPositions = req.body;
        console.log(openPositions)
        let OpenPosition = OpenPositionModel();
        let deleteData = await OpenPosition.deleteMany({})
        if (deleteData.acknowledged) {
            let data = await OpenPosition.insertMany(openPositions);
            if (data)
                return res.json({ status: "Success" });
        }
        else {
            return res.status(400).end();
        }
    }
    catch (e) {
        console.log(e.message);
    }
}
module.exports = addOpenPositionMaster;