const SwapChangeMasterModel = require("../../../schemas/dailySwapChangeMaster");

const getHoldingCostMaster = async function (req, res, next) {
    try {
        let SwapChangeMaster = SwapChangeMasterModel();
        let { startDate, endDate, client, symbol } = req.body;
        console.log(client, "    ", symbol)
        startDate = startDate == "" ? null : startDate;
        endDate = endDate == "" ? null : endDate;
        client = client == "" ? null : client;
        symbol = symbol == "" ? null : symbol;
        let searchQuery = {};
        function dateObject(startDate, endDate) {
            searchQuery = {
                $and: [
                    { createdAt: { $gte: new Date(startDate) } },
                    { createdAt: { $lte: new Date(endDate) } }
                ]
            }
        }
        if (startDate != null && endDate != null) {
            dateObject(startDate, endDate)
            if (client != null) {
                searchQuery.client = client;
            }
            if (symbol != null) {
                searchQuery.symbol = symbol;
            }
        }
        else if (client != null) {
            searchQuery.client = client;
            if (startDate != null && endDate != null) {
                dateObject(startDate, endDate)
            }
            if (symbol != null) {
                searchQuery.symbol = symbol;
            }
        }
        else if (symbol != null) {
            searchQuery.symbol = symbol;
            if (startDate != null && endDate != null) {
                dateObject(startDate, endDate)
            }
            if (client != null) {
                searchQuery.client = client;
            }
        }
        console.log(JSON.stringify(searchQuery))
        let data = await SwapChangeMaster.aggregate(
            [
                {
                    $match: searchQuery
                },
                {
                    $facet: {
                        statistics: [
                            {
                                $group: {
                                    _id: null,
                                    totalSwap: { $sum: { "$add": ["$lpCost", "$rebateableSwap"] } },
                                    totalMarkup: { $sum: "$markup" },
                                    totalLpSwap: { $sum: "$lpCost" },
                                    totalClients: { $addToSet: "$client" },
                                    totalSymbols: { $addToSet: "$symbol" },
                                    totalPosition: { $addToSet: "$position" },
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    totalSwap: 1,
                                    totalMarkup: 1,
                                    totalLpSwap: 1,
                                    totalClients: { $size: "$totalClients" },
                                    totalSymbols: { $size: "$totalSymbols" },
                                    totalPosition: { $size: "$totalPosition" },
                                }
                            }
                        ],
                        uniqueLists: [
                            {
                                $group: {
                                    _id: null,
                                    totalClients: { $addToSet: "$client" },
                                    totalSymbols: { $addToSet: "$symbol" },
                                    totalPosition: { $addToSet: "$position" },
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    totalClients: 1,
                                    totalSymbols: 1,
                                    totalPosition: 1,
                                }
                            }
                        ],
                        topClientsGeneratingSwap: [
                            {
                                $group: {
                                    _id: "$client",
                                    clientSwap: {
                                        $sum: { "$add": ["$lpCost", "$rebateableSwap"] }
                                    }
                                }
                            },
                            {
                                $sort: {
                                    clientSwap: -1
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    client: "$_id",
                                    clientSwap: 1
                                }
                            },
                            {
                                $limit: 5
                            }
                        ],
                        topSymbolsGeneratingSwap: [
                            {
                                $group: {
                                    _id: "$symbol",
                                    symbolSwap: {
                                        $sum: { "$add": ["$lpCost", "$rebateableSwap"] }
                                    }
                                }
                            },
                            {
                                $sort: {
                                    symbolSwap: -1
                                }
                            },
                            {
                                $project: {
                                    symbol: "$_id",
                                    symbolSwap: 1,
                                    _id: 0
                                }
                            },
                            {
                                $limit: 5
                            }
                        ],
                        swapChangeMasterData: [
                            {
                                $project: {
                                    _id: 1,
                                    client: 1,
                                    position: 1,
                                    symbol: 1,
                                    dailySwapChange: 1,
                                    finalRate: 1,
                                    baseRate: 1,
                                    markupRate: 1,
                                    markup: 1,
                                    lpCost: 1,
                                    rebateableSwap: 1,
                                    platform: 1,
                                    feeGroup: 1,
                                    createdAt: 1
                                }
                            }
                        ],
                        barCharData: [
                            {
                                $group: {
                                    _id: { $substr: ["$createdAt", 0, 10] },
                                    dailySwapChange: {
                                        $sum: { "$add": ["$lpCost", "$rebateableSwap"] }
                                    },
                                    lpCost: {
                                        $sum: "$lpCost"
                                    },
                                    rebateableSwap: {
                                        $sum: "$rebateableSwap"
                                    }
                                }
                            },
                            {
                                $sort: {
                                    _id: -1
                                }
                            },
                            {
                                $project: {
                                    createdDate: "$_id",
                                    dailySwapChange: 1,
                                    lpCost: 1,
                                    rebateableSwap: 1,
                                    _id: 0
                                }
                            },
                            {
                                $project: {
                                    data: [
                                        { createdDate: "$createdDate", type: "lpCost", value: "$lpCost" },
                                        { createdDate: "$createdDate", type: "rebateableSwap", value: "$rebateableSwap" }
                                    ]
                                }
                            },
                            {
                                $unwind: "$data"
                            },
                            {
                                $replaceRoot: {
                                    newRoot: "$data",
                                },
                            },
                        ]
                    }
                }
            ]
        );
        res.json(data);
    }
    catch (e) {
        console.log(e.message);
    }
}
module.exports = getHoldingCostMaster;