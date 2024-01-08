const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSymbolConfigurationSchema = new Schema(
    {
        groupName: { type: String, required: true },
        symbolName: { type: String, required: true },
        minLot: { type: Number, required: true },
        maxLot: { type: Number, required: true },
        setpInterval: { type: Number, required: true },
        groupLevelSpread: { type: Number, required: true },
        swapShort: { type: Double, required: true },
        swapLong: { type: Double, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = () => { let exportedModel = mongoose.connection.model('groupsymbolconfigurations', groupSymbolConfigurationSchema); return exportedModel; };

