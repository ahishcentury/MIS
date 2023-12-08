const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModules = Schema(
    {
        moduleName: { type: String, required: true },
        permission: { roles: { type: JSON } },
    },
    { timestamps: true }
);

module.exports = mongoose.model("usermodules", UserModules);