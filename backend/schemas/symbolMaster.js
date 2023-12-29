const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const symbolMasterSchema = new Schema(
    {
        symbolName: { type: String, required: true },
        path: { type: String, required: true },
        description: { type: String, required: true },
        sector: { type: String, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        step: { type: Number, required: true },
        limit: { type: Number, required: true },
        stoplevel: { type: Number, required: true },
        baseCur: { type: String, required: true },
        profitCur: { type: String, required: true },
        marginCur: { type: String, required: true },
        commission: { type: Number, required: true },
        spread: { type: Number, required: true },
        margin: { type: Number, required: true },
        spreaddef: { type: Number, required: true },
        contractSize: { type: Number, required: true },
        swapShort: { type: Double, required: true },
        swapLong: { type: Double, required: true },
        status: { type: Number }
    },
    {
        timestamps: true
    }
);

const symbolMaster = mongoose.model('symbolmaster', symbolMasterSchema);
module.exports = symbolMaster;