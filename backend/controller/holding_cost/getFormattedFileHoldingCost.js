const HoldingRateMaster = require("../../schemas/holdingRateMaster");

module.exports = async function (req, res, next) {
  let masters = null;
  try {
    masters = await HoldingRateMaster.find({}).sort({ createdAt: -1 }).limit(7);

    if (masters) {
      res.json(masters);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(500).end();
  }
};
