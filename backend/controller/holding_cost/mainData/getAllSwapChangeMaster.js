const SwapChangeMasterModel = require("../../../schemas/dailySwapChangeMaster");

const getAllSwapChangeMaster = async function (req, res, next) {
    try {
        let SwapChangeMaster = SwapChangeMasterModel();
        let data = await SwapChangeMaster.find({});
        if (data)
            return res.json(data);

    }
    catch (e) {
        console.log(e.message);
    }
}
module.exports = getAllSwapChangeMaster;