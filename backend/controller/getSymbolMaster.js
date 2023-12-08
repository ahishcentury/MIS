const symbolSchema = require("../schemas/symbolMaster");

module.exports = async function (req, res) {
    // const {calledBy} = req.body;
    // const data = await symbolSchema.aggregate([
    //     {
    //         $project: {
    //             k: "$symbolName",
    //             v: "$$ROOT",
    //             _id: 0
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             symbolMaster: {
    //                 $push: "$$ROOT"
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             symbolMaster: {
    //                 $arrayToObject: "$symbolMaster"
    //             }
    //         }
    //         // $project: {
    //         //     symbolMaster: {
    //         //         $cond: {
    //         //             if: {
    //         //                 $eq: [calledBy, "symbolMaster"]
    //         //             },
    //         //             then: "$symbolMaster",
    //         //             else: { $arrayToObject: "$symbolMaster" }
    //         //         }
    //         //     }
    //         // }
    //     }
    // ]);
    const data1 = await symbolSchema.find({});
    // if(calledBy == "symbolMaster")
    return res.json(data1);
    // return res.json(data[0]["symbolMaster"]);
}