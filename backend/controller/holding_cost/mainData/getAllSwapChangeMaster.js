const SwapChangeMaster = require("../../schemas/dailySwapChangeMaster");

const getSwapChangeData = async function (req, res, next) {
    try {
        let data = await SwapChangeMaster.find({});
        if (data)
            return res.json({ status: "Success" });
    }
    catch (e) {
        console.log(e.message);
    }
}
module.exports = getSwapChangeData;