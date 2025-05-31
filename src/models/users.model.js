const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ENV_VARIABLES } = require('../utils/constants');

const workExperienceSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    isCurrent: {
        type: Boolean,
        default: false
    },
    location: String,
    responsibilities: [String]
});

const educationSchema = new mongoose.Schema({
    institution: {
        type: String,
        required: true
    },
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your first name and last name ... it is required!"],
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: val => /^\+?[0-9\s\-]{7,15}$/.test(val),
            message: "Invalid phone number"
        }
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        lowercase: true,
        unique: true,
        trim: true,
        validate: {
            validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val),
            message: "Invalid Email...!"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minlength: 6,
        select: false
    },
    location: {
        type: String,
        trim: true
    },
    country: {
        type: String
    },
    workExperiences: [workExperienceSchema],
    education: [educationSchema],
    skills: [String],
    totalExperience: {
        type: new mongoose.Schema({
            years: {
                type: Number,
                default: 0
            },
            months: {
                type: Number,
                default: 0
            }
        }),
        default: () => ({
            years: 0,
            months: 0
        })
    },
    refferalPreferences: {
        giveRefferals: {
            type: Boolean,
            default: false
        },
        takeRefferals: {
            type: Boolean,
            default: true
        }
    },
    resumeUrl: {
        type: String,
        trim: true
    },
    refferalQuota: {
        searchQuotaUsed: {
            type: Number,
            default: 0
        },
        requestQuotaUsed: {
            type: Number,
            default: 0
        },
        lastReset: {
            type: Date,
            default: Date.now
        }
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign(
        {
            userId: this._id
        },
        ENV_VARIABLES.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ENV_VARIABLES.ACCESS_TOKEN_EXPIRY
        });
    return accessToken;
}
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        {
            userId: this._id
        },
        ENV_VARIABLES.REFRESH_TOKEN_SECRET,
        {
            expiresIn: ENV_VARIABLES.REFRESH_TOKEN_EXPIRY
        });
    return refreshToken;
}


module.exports = {
    User: mongoose.model("User", userSchema)
}