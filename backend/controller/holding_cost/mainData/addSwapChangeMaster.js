const SwapChangeMaster = require("../../schemas/dailySwapChangeMaster");

const addSwapChangeData = async function (req, res, next) {
    try {
        const dailySwapChangeData = req.body;
        console.log(openPositions)
        let deleteData = await SwapChangeMaster.deleteMany({})
        if (deleteData.acknowledged) {
            let data = await SwapChangeMaster.insertMany(dailySwapChangeData);
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
module.exports = addSwapChangeData;