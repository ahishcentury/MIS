const mongoose = require("mongoose");
const Double = require("@mongoosejs/double/lib");
const Schema = mongoose.Schema;

const dailySwapChangeMasterSchema = new Schema(
    {
        client: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        symbol: {
            type: String,
            required: true
        },
        dailySwapChange: {
            type: Double,
            required: true
        },
        finalRate: {
            type: String,
            required: true
        },
        baseRate: {
            type: String,
            required: true
        },
        markupRate: {
            type:
                String,
            required: true
        },
        markup: {
            type:
                Double,
            required: true
        },
        lpCost: {
            type: Double,
            required: true
        },
        rebateableSwap: {
            type: Double,
            required: true
        },
        platform: {
            type: String,
            required: true
        },
        feeGroup: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const dailySwapChangeMaster = mongoose.model('dailyswapchangemasters', dailySwapChangeMasterSchema);
module.exports = dailySwapChangeMaster;