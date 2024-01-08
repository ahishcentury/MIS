const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupCommissionConfigurationSchema = new Schema(
    {
        groupName: { type: String, required: true },
        symbolPath: { type: String, required: true },
        comType: { type: String, required: true },
        rangeType: { type: String, required: true },
        chargeType: { type: String, required: true },
        from: { type: Double, required: true },
        to: { type: Double, required: true },
        commission: { type: Double, required: true },
        min: { type: Double, required: true },
        max: { type: Double, required: true },
        mode: { type: String, required: true },
        type: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = () => { let exportedModel = mongoose.connection.model('groupcommissionconfigurations', groupCommissionConfigurationSchema); return exportedModel; };