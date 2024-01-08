const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('@mongoosejs/double');

const userRoleSchema = new Schema({
    roleName: { type: String },
    reportsTo: { type: String },
    desc: { type: String },
    perms: {
        type: Array, default: []
    },
    removable: { type: Boolean, required: true, default: true },
    softDeleted: {
        type: Boolean, default: false
    }
}, {
    timestamps: true,
});

module.exports = () => { let exportedModel = mongoose.connection.model('userroles', userRoleSchema); return exportedModel; }