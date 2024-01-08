const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('@mongoosejs/double');

const securitySchema = new Schema({
    name: { type: String, required: true },

    symbol: { type: String, unique: true, trim: true, required: true },

    desc: { type: String, trim: true, required: true },

    sector: { type: String, trim: true, required: true },

    minLotSize: { type: Double, required: true },

    maxLotSize: { type: Double, required: true },

    stepInterval: { type: Number, required: true },

    positionLimit: { type: Double, required: true },

    limitStopLevel: { type: Double, required: true },

    baseCurrency: { type: String, trim: true, required: true },

    marginCurrency: { type: String, trim: true, required: true },

    commissionFee: { type: Double, required: true },

    spreadFee: { type: Double, required: true }

}, {
    timestamps: true,
});


module.exports = () => { let exportedModel = mongoose.connection.model('Security', securitySchema); return exportedModel; };