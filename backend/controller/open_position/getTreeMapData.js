const OpenPositionModel = require("../../schemas/openPosition");
let path = require("path");
const fs = require("fs");
const getTreeMapData = async (req, res, next) => {

    try {
        let { filterByClient, filterByPositionDirection, filterBySymbol } = req.body;
        let searchQuery = {};
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
        const query = "byVolume";
        let queryMap = {}
        if (query == "bycount") {
            queryMap.txnCount = -1
        }
        if (query == "byVolume") {
            queryMap.transactionVolume = -1
        }
        if (query == "distinctUser") {
            queryMap.distinctUser = -1
        }
        let currencyMap = JSON.parse(fs.readFileSync(path.join(__dirname, "../../helper/currencyMap.json")));
        let jsFunctionBody = `function(profitCur , currencyMap){
            try{
                return currencyMap[profitCur];
            }
            catch(e){
                return 1;
            }
        }`;
        let jsFunction = {
            body: jsFunctionBody,
            args: ["$profitCur", currencyMap],
            lang: "js"
        }
        let OpenPosition = OpenPositionModel();
        let data = await OpenPosition.aggregate([
            {
                $match: searchQuery
            },
            {
                $facet: {
                    symbolTxnsCount: [
                        {
                            $group: {
                                _id: "$symbol",
                                txnCount: { $sum: 1 },
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: "$_id",
                                value: "$txnCount"
                            }
                        },
                        {
                            $sort: queryMap
                        }
                    ],
                    symbolTxnsVolume: [
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
                                symbol: 1,
                                price: 1,
                                lotsize: 1,
                                profitCur: "$symbolmasterProfitCurrency.profitCur"
                            }
                        },
                        {
                            $group: {
                                _id: "$symbol",
                                transactionVolume: {
                                    $sum: {
                                        $multiply: ["$price", "$lotsize", { $function: jsFunction }]
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: "$_id",
                                value: "$transactionVolume"
                            }
                        },
                        {
                            $sort: queryMap
                        }
                    ],
                    symbolTxnsDistinctUser: [
                        {
                            $group: {
                                _id: "$symbol",
                                distinctUser: {
                                    $addToSet: "$loginid"
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: "$_id",
                                value: { $size: "$distinctUser" }
                            }
                        },
                        {
                            $sort: queryMap
                        }
                    ],

                }
            }
        ]);
        res.json(data);
    }
    catch (e) {
        res.status(500).end();
    }
}
module.exports = getTreeMapData;