const OpenPositionModel = require("../../schemas/openPosition");
let path = require("path");
const fs = require("fs");
const getOpenPositionMaster = async (req, res, next) => {
    try {
        let { filterByClient, filterByPositionDirection, filterBySymbol } = req.body;
        let searchQuery = {}
        let OpenPosition = OpenPositionModel();
        filterByClient = filterByClient == "" || filterByClient == "All" ? null : filterByClient;
        filterByPositionDirection = filterByPositionDirection == "" || filterByPositionDirection == "All" ? null : filterByPositionDirection;
        filterBySymbol = filterBySymbol == "" || filterBySymbol == "All" ? null : filterBySymbol;
        if (filterByClient != null) {
            searchQuery.loginid = filterByClient
            if (filterByPositionDirection != null) {
                searchQuery.type = filterByPositionDirection;
            }
            if (filterBySymbol != null) {
                searchQuery.symbol = filterBySymbol;
            }
        }

        else if (filterByPositionDirection != null) {
            searchQuery.type = filterByPositionDirection;
            if (filterByClient != null) {
                searchQuery.loginid = filterByClient
            }
            if (filterBySymbol != null) {
                searchQuery.symbol = filterBySymbol;
            }
        }
        else if (filterBySymbol != null) {
            searchQuery.symbol = filterBySymbol;
            if (filterByPositionDirection != null) {
                searchQuery.type = filterByPositionDirection;
            }
            if (filterByClient != null) {
                searchQuery.loginid = filterByClient
            }
        }
        else {
            searchQuery = {}
        }
        let currencyMap = JSON.parse(fs.readFileSync(path.join(__dirname, "../../helper/currencyMap.json")));
        let jsFunctionBody = `function(profitCurSymbol,currencyMap){
            try{
              return currencyMap[profitCurSymbol]
            }catch(e){
              return 1;
            }
        }`;
        let jsFunction = {
            body: jsFunctionBody,
            args: ["$profitCur", currencyMap],
            lang: "js",
        }
        let data = await OpenPosition.aggregate(
            [
                {
                    $match: searchQuery
                },
                {
                    $facet: {
                        //Good Learn
                        // profitCurrency: [
                        //     {
                        //         $lookup: {
                        //             from: "symbolmasters",
                        //             localField: "symbol",
                        //             foreignField: "symbolName",
                        //             as: "symbolmasterProfitCurrency"
                        //         }
                        //     },
                        //     {
                        //         $unwind: "$symbolmasterProfitCurrency"
                        //     },
                        //     {
                        //         $project: {
                        //             _id: 0,
                        //             symbol: 1,
                        //             profitCur: "$symbolmasterProfitCurrency.profitCur"
                        //         }
                        //     },
                        //     {
                        //         $group: {
                        //             _id: "$symbol",
                        //             profitCurList: {
                        //                 $addToSet: "$profitCur"
                        //             },
                        //         }
                        //     },
                        //     {
                        //         $unwind: "$profitCurList"
                        //     },
                        //     {
                        //         $project: {
                        //             _id: 0,
                        //             symbol: "$_id",
                        //             profitCurrency: "$profitCurList"
                        //         }
                        //     }
                        // ],
                        statistics: [
                            {
                                $lookup: {
                                    from: "symbolmasters",
                                    localField: "symbol",
                                    foreignField: "symbolName",
                                    as: "symbolmasterProfitCurrency"
                                }
                            },
                            {
                                $unwind: {
                                    'path': "$symbolmasterProfitCurrency",
                                    'preserveNullAndEmptyArrays': true
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    swap: 1,
                                    symbol: 1,
                                    loginid: 1,
                                    price: 1,
                                    lotsize: 1,
                                    profitCur: "$symbolmasterProfitCurrency.profitCur"
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    countOfOpenPosition: {
                                        $sum: 1
                                    },
                                    unRealizedSwapTotal: {
                                        $sum: "$swap"
                                    },
                                    symbolList: {
                                        $addToSet: "$symbol"
                                    },
                                    userList: {
                                        $addToSet: "$loginid"
                                    },
                                    tradeVolumeTotal: {
                                        $sum: {
                                            $multiply: ["$price", "$lotsize",
                                                {
                                                    $function: jsFunction
                                                }
                                            ]
                                        }
                                    },

                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    symbolmasterProfitCurrency: 1,
                                    countOfOpenPosition: 1,
                                    unRealizedSwapTotal: 1,
                                    tradeVolumeTotal: 1,
                                    symbolCount: {
                                        $size: "$symbolList"
                                    },
                                    userCount: {
                                        $size: "$userList"
                                    },
                                }
                            }
                        ],
                        uniqueLists: [
                            {
                                $group: {
                                    _id: null,
                                    symbolList: {
                                        $addToSet: "$symbol"
                                    },
                                    userList: {
                                        $addToSet: "$loginid"
                                    }

                                },
                            },
                            {
                                $project: {
                                    _id: 0
                                }
                            }
                        ],
                        openPositionMaster: [
                            {
                                $project: {
                                    _id: 1,
                                    swap: 1,
                                    symbol: 1,
                                    loginid: 1,
                                    price: 1,
                                    lotsize: 1,
                                    type: 1,
                                    profitCur: 1,
                                    reason: 1
                                },
                            }
                        ],
                        topUserListByTransactionVolume: [
                            {
                                $lookup: {
                                    from: "symbolmasters",
                                    localField: "symbol",
                                    foreignField: "symbolName",
                                    as: "symbolmasterProfitCurrency"
                                }
                            },
                            {
                                $unwind: {
                                    'path': "$symbolmasterProfitCurrency",
                                    'preserveNullAndEmptyArrays': true
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    loginid: 1,
                                    price: 1,
                                    lotsize: 1,
                                    profitCur: "$symbolmasterProfitCurrency.profitCur"
                                }
                            },
                            {
                                $group: {
                                    _id: "$loginid",
                                    transactionVolumePerUser: {
                                        $sum: {
                                            $multiply: ["$price", "$lotsize",
                                                {
                                                    $function: jsFunction
                                                }
                                            ]
                                        }
                                    },
                                },
                            },
                            {
                                $sort: {
                                    transactionVolumePerUser: -1
                                }
                            },
                            {
                                $limit: 5
                            }
                        ],
                        topUserListByTransactionCount: [
                            {
                                $group: {
                                    _id: "$loginid",
                                    transactionCount: {
                                        $sum: 1
                                    }
                                },
                            },
                            {
                                $sort: {
                                    transactionCount: -1
                                }
                            },
                            {
                                $limit: 3
                            }
                        ],
                        treeMapData: [
                            {
                                $group: {
                                    _id: "$symbol",
                                    tradedSymbolCount: {
                                        $sum: 1
                                    },
                                    transactionAmountInSymbol: {
                                        $sum: {
                                            $multiply: [
                                                "$price",
                                                "$lotsize",
                                                {
                                                    $function: jsFunction
                                                }]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ],
        );
        return res.json(data)
    }
    catch (e) {
        return res.status(500).end();
    }
}
module.exports = getOpenPositionMaster;