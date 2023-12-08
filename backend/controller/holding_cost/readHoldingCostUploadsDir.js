const fs = require('fs');
const { parse } = require("csv-parse");
const HoldingRateMaster = require("../../schemas/holdingRateMaster");
module.exports = async function ReadHoldingCostUploadsDir(req, res) {
    let uploadedLatestData = []
    let mongoLatestData = []
    let dataread = []
    filenames = fs.readdirSync(__dirname + '../../../holding_cost_uploads/', { withFileTypes: true });
    let data = await HoldingRateMaster.find({});
    if (data.length != 0 && filenames.length != 0) {
        if (data[data.length - 1].originalName == filenames[0].name) {
            return res.json(data);
        }
        else {
            await new Promise(function (myResolve, myReject) {
                fs.createReadStream(__dirname + '../../../holding_cost_uploads/' + filenames[0].name)
                    .pipe(parse({ delimiter: ",", from_line: 1 }))
                    .on("data", function (row) {
                        uploadedLatestData.push(row);
                        myResolve(row);
                    })
                    .on("end", function () {
                        console.log("finished");
                    })
                    .on("error", function (error) {
                        console.log(error.message);
                        myReject(error);
                    });
            });
            await new Promise(function (myResolve, myReject) {
                fs.createReadStream(__dirname + '../../../holding_cost_uploads/' + filenames[1].name)
                    .pipe(parse({ delimiter: ",", from_line: 1 }))
                    .on("data", function (row) {
                        mongoLatestData.push(row);
                        myResolve(row);
                    })
                    .on("end", function () {
                        console.log("finished");
                    })
                    .on("error", function (error) {
                        console.log(error.message);
                        myReject(error);
                    });
            });

        }
    }
    if (data.length == 0 && filenames.length != 0) {
        let uploaded = await new HoldingRateMaster({
            originalName: filenames[0].name,
            uploadedBy: "Admin",
            uploadedName: filenames[0].name
        }).save();
        if (uploaded) {
            console.log("Data added Succesfully");
            data = await HoldingRateMaster.find({});
            return res.json(data);
        }
    }

    //now here make comparison for changes
    if (mongoLatestData.length > 0) {
        let changes = {};
        let oldData = {};
        let currentData = {}
        let symbol = {};
        for (let i = 0; i < uploadedLatestData.length - 1; i++) {
            oldData = {};
            currentData = {};
            let temp = false;
            if (uploadedLatestData[i][0] != mongoLatestData[i][0]) {
                oldData["instrumentName"] = mongoLatestData[i][0];
                currentData["instrumentName"] = uploadedLatestData[i][0];
                temp = true;
            }
            if (uploadedLatestData[i][1] != mongoLatestData[i][1]) {
                oldData["longFinanace"] = mongoLatestData[i][1];
                currentData["longFinanace"] = uploadedLatestData[i][1];
                temp = true;
            }
            if (uploadedLatestData[i][2] != mongoLatestData[i][2]) {
                oldData["matching_description_with_tu_meta"] = mongoLatestData[i][2];
                currentData["matching_desc_with_tu_meta"] = uploadedLatestData[i][2];
                temp = true;
            }
            if (uploadedLatestData[i][3] != mongoLatestData[i][3]) {
                oldData["matching_symbol_with_tu_meta"] = mongoLatestData[i][3];
                currentData["matching_symbol_with_tu_meta"] = uploadedLatestData[i][3];
                temp = true;
            }
            if (uploadedLatestData[i][4] != mongoLatestData[i][4]) {
                oldData["shortFinanace"] = mongoLatestData[i][4];
                currentData["shortFinanace"] = uploadedLatestData[i][4];
                temp = true;
            }
            if (uploadedLatestData[i][5] != mongoLatestData[i][5]) {
                oldData["type"] = mongoLatestData[i][5];
                currentData["type"] = uploadedLatestData[i][5];
                temp = true;
            }
            symbol["old"] = oldData;
            symbol["current"] = currentData;
            if (temp == true) {
                changes[[uploadedLatestData[i][0]]] = {
                    "old": oldData,
                    "current": currentData
                }
            }
        }
        if (changes != {}) {
            let uploadedLatest = await new HoldingRateMaster({
                originalName: filenames[0].name,
                uploadedBy: "Admin",
                uploadedName: filenames[0].name,
                changes: changes
            }).save();
            if (uploadedLatest) {
                console.log("Data added Succesfully");
                data = await HoldingRateMaster.find({});
                return res.json(data);
            }
        }
    }
}