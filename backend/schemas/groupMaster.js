const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupMasterSchema = new Schema(
    {
        message: { type: String, required: true },
        groupName: { type: String, required: true },
        envType: { type: String, required: true },
        platfrom: { type: String, required: true },
        currency: { type: String, required: true },
        maringMode: { type: String, required: true },
        maringCall: { type: Number, required: true },
        marginStopUp: { type: Number, required: true },
        leverage: { type: Number, required: true },

    },
    {
        timestamps: true
    }
);

const groupMaster = mongoose.model('groupmanagements', groupMasterSchema);
module.exports = groupMaster;