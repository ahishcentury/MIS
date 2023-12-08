const HoldingRateMaster = require("../../schemas/holdingRateMaster");

module.exports = async function (req, res, next) {
    let masters = null;
    let { fileName } = req.params;
    console.log(fileName)
    try {
        masters = await HoldingRateMaster.find({ originalName: fileName });

        if (masters) {
            res.json(masters);
        } else {
            res.status(404).end();
        }
    } catch (e) {
        res.status(500).end();
    }
};
