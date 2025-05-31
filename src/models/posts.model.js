const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    descripton: {
        type: String
    },
    company: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    experienceMin: {
        type: Number
    },
    experienceMax: {
        type: Number
    },
    jobLocation: {
        type: String
    },
    salaryMin: {
        type: Number
    },
    salaryMax: {
        type: Number
    },
    contactPerson: {
        name: String,
        userUid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    },
    url: {
        type: String
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);
module.exports = {
    Post
}