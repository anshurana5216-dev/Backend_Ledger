const mongoose = require("mongoose");


const tokenBlacklistModel = new mongoose.Schema({
    token: {
        type: String,
        required: [true , "token is required to blacklist"],
        unique: [true , "token is already blacklisted"],
    },
    blacklistedAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    }
} , {
    timestamps: true
})

tokenblacklistModel.index({ blacklistedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 }); // Expire after 3 days (in seconds)


const tokenblacklistModel = mongoose.model("TokenBlacklist" , tokenBlacklistModel);


module.exports = tokenblacklistModel;
