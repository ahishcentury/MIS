let FormattedFileModel = require("../../schemas/holdingRateMaster");
const fs = require("fs");
const path = require("path");

module.exports = async function (req, res, next) {
  const { fileId } = req.params;
  let FormattedFile = FormattedFileModel()
  let data = await FormattedFile.findByIdAndDelete(fileId)

  if (data) {
    try {
      console.log("UnLinking");
      console.log(data.uploadedName);
      fs.unlinkSync(
        path.join(
          __dirname,
          "../../holding_cost_uploads/" +
          data.uploadedName
        )
      );
      console.log("UnLinking is Successful");
      res.status(200).end();
    } catch (e) {
      console.log("Error removing", e.message);
      return res.status(200).end();
    }
  } else {
    res.status(400).end();
  }
}
