const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dailySwapChangeMasterSchema = new Schema(
    {
        client: {
            type: String,
            required: true
        },
        positionId: {
            type: String,
            required: true
        },
        symbol: {
            type: String,
            required: true
        },
        dailySwapChange: {
            type: String,
            required: true
        },
        finalRate: {
            type: String,
            required: true
        },
        baseRate: {
            type:
                String, required: true
        },
        markup: {
            type:
                String, required: true
        },
        LPCost: {
            type:
                String, required: true
        },
        rebateableSwap: {
            type:
                String, required: true
        },
    },
    {
        timestamps: true
    }
);

const dailySwapChangeMaster = mongoose.model('dailyswapchangemasters', dailySwapChangeMasterSchema);
module.exports = dailySwapChangeMaster;