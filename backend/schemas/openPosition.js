const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var Double = require("mongodb").Double;
const openPositionSchema = new Schema(
    {
        loginid: {
            type: Number,
            required: "LoginId is required",
        },
        positionid: {
            type: Number,
            required: [true, "Position ID cannot be blank"],
        },
        orderId: {
            type: Number,
            required: [true, "OrderID cannot be blank"],
        },
        symbol: {
            type: String,
            trim: true,
            required: [true, "Symbol cannot be blank"],
        },
        lotsize: {
            type: Double,
            trim: true,
            required: [true, "Lots cannot be blank"],
        },
        type: {
            type: String,
            required: [true, "Type cannot be blank"],
        },
        opentime: {
            type: String,
            required: [true, "Open Time cannot be blank"],
        },
        price: {
            type: Double,
            required: [true, "Txn Price cannot be blank"],
        },
        //meaning whether user has opened or closed position (in/out)  this is the TU Dashboard
        entry: {
            type: String,
            // required: [true, "Entry cannot be blank"],
        },
        commssion: {
            type: Number,
            required: [true, "Commission cannot be blank"],
        },
        reason: {
            type: String,
            // required: [true, "Reason cannot be blank"],
        },
        name: {
            type: String,
        },

        swap: {
            type: Double,
        },
        comment: {
            type: String,
        },
        swapLong: {
            type: Double,
        },
        swapShort: {
            type: Double,
        },
        baseCur: {
            type: String,
        },
        profitCur: {
            type: String,
        },
        marginCur: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = () => { let exportedModel = mongoose.connection.model('openpositions', openPositionSchema); return exportedModel; };