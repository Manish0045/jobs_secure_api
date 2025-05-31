const mongoose = require('mongoose');

const refferalSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refferer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    company: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    },
    requestedOn: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Refferal = mongoose.model("Refferal", refferalSchema);
module.exports = {
    Refferal
}