const mongoose = require("mongoose");
let bcrypt = require("bcrypt");
const Double = require("@mongoosejs/double/lib");
let SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const userSchema = new Schema(
    {
        username: { type: String },
        fname: {
            type: String,
            default: "",
        },
        lname: {
            type: String,
            default: "",
        },
        accountType: {
            type: String,
            required: true,
            default: 'individual'
        },
        // 1 = individual 2 = corporate
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: "Email address is required",
            validate: [validateEmail, "Please fill a valid email address"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password cannot be blank"],
        },
        role: {
            /*
            Possible Values=> "OP" - Operations, "CO" - Compliance Officer, Legal - "LGL", Department Head - 'DH'
      
            "OP" role will send everything for approval (user approval, deposit, withdraw etc..) up the hierarchy.
      
            Deposit/Withdrawal approval process will not involve "LGL" role
      
            */
            type: mongoose.Mixed,
            required: [true, "User Role cannot be blank"],
        },
        phone: {
            type: String,
            unique: true,
            required: [true, "User Contact cannot be empty"],
        },
        dob: {
            type: Date,
            required: "Date of birth cannot be blank",
        },
        handlerId: {
            type: mongoose.Types.ObjectId,
            default: null
        },
        tickets: { type: Array },
        /**
         * Password Reset Code 
         * {
         * code:123422,
         * generatedAt:new Date()
         * 
         * }
         */
        verCode: {
            type: JSON, default: {}
        },
        eKYC: {
            type: JSON
        },
        activated: {
            type: Boolean, default: true
        },
        softDeleted: {
            type: Boolean, default: false
        }

    },
    {
        timestamps: true,
    }
);

userSchema.pre("update", function (next) {
    let user = this;

    console.log("Beofore updating inside user schema");
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.pre("save", function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", userSchema);
