let multer = require("multer");
let HoldingCostMaster = require("../../schemas/holdingRateMaster");
var path = require("path");
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(
            null,
            path.join(
                __dirname,
                "../../holding_cost_support_files/lp_holding_rates/"
            )
        );
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
let imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(csv)$/)) {
        return cb(new Error("Only csv files are allowed!"), false);
    }
    cb(null, true);
};
let upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    storage: storage,
    fileFilter: imageFilter,
}).single("holdingRateMaster");

module.exports = function (req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err) {
                console.log(err.message);
                return res.status(500).end();
            }
            else {
                return res.json("File Uploaded Successfully");
                // PythonShell.run(
                //   path.join(__dirname, "../../../scripts/profileMasterPython.py"),
                //   null
                // )
                //   .then((messages) => {
                //     console.log("Script finished");
                //     res.json({ uploadStatus: uploaded, scriptStatus: messages });
                //   })
                //   .catch((e) => {
                //     console.log("Error occured during script execution", e);
                //   });
            }

        });
    } catch (e) {
        console.log(e.message);
        res.status(500).end();
    }
};
