const SwapChangeMasterModel = require("../../../schemas/dailySwapChangeMaster");

const addSwapChangeMaster = async function (req, res, next) {
    try {
        let SwapChangeMaster = SwapChangeMasterModel();
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