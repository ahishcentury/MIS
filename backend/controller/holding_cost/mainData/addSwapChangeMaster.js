const SwapChangeMaster = require("../../../schemas/dailySwapChangeMaster");

const addSwapChangeMaster = async function (req, res, next) {
    try {
        const dailySwapChangeData = req.body;
        let data = await SwapChangeMaster.insertMany(dailySwapChangeData);
        if (data)
            return res.json({ status: "Success", data: data });
    }
    catch (e) {
        console.log(e.message);
    }
}
module.exports = addSwapChangeMaster;