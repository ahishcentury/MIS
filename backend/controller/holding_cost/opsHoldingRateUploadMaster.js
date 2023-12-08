let multer = require("multer");
let SwapMaster = require("../../schemas/swapMaster");
var path = require("path");
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(
            null,
            path.join(
                __dirname,
                "../../holding_cost_support_files/ops_holding_rates/"
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
}).single("swapMaster");

module.exports = function (req, res, next) {
    try {
        upload(req, res, async function (err) {
            if (err) {
                console.log(err.message);
                return res.status(500).end();
            }
            return res.json("File Uploaded Succesfully");
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).end();
    }
};
