const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const holdingRateMaster = new Schema(
    {
        originalName: { type: String },
        uploadedName: { type: String },
        uploadedBy: { type: String },
        changes: { type: JSON, default: {} },
    },
    {
        timestamps: true,
    }
);

module.exports = () => { let exportedModel = mongoose.connection.model('holdingratemasters', holdingRateMaster); return exportedModel; };