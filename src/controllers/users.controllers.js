const { User } = require('../models/users.model');
const ApiError = require('../utils/apiError.handler');
const AsyncHandler = require('../middlewares/asyncHandler.middleware');
const { STATUS_CODES, cookieOptions, refreshTokenCookieOptions } = require('../utils/constants');
const ApiResponse = require('../utils/apiResponse.handler');

async function generateAccessAndRefreshToken(user) {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError({
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Something went wrong while generating tokens...!"
        });
    }
}

const signUp = AsyncHandler(async (req, res) => {
    const {
        name,
        phone,
        email,
        password,
        location,
        country,
        skills,
        workExperiences,
        education,
        totalExperience,
        refferalPreferences,
        refferalQuota
    } = req.body;

    if ([name, email, phone, password].some(val => !val)) {
        throw new ApiError({ statusCode: STATUS_CODES.BAD_REQUEST, message: "Missing required data!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError({ statusCode: STATUS_CODES.CONFLICT, message: "Email is already in use!" });
    }

    const resumeUrl = req.file?.path || "";

    const newUser = new User({
        name,
        email,
        phone,
        password,
        location: location || "",
        country: country || "",
        skills: skills || null,
        workExperiences: workExperiences || null,
        education: education || null,
        totalExperience: totalExperience || 0,
        refferalPreferences: refferalPreferences || null,
        resumeUrl,
        refferalQuota: refferalQuota || 0
    });

    const user = await newUser.save();
    if (!user) {
        throw new ApiError({ statusCode: STATUS_CODES.FORBIDDEN, message: "Something went wrong while creating user!" });
    }

    res.status(STATUS_CODES.CREATED).json(new ApiResponse({
        statusCode: STATUS_CODES.CREATED,
        data: user,
        message: "User created successfully!"
    }));
});

const signIn = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError({ statusCode: STATUS_CODES.BAD_REQUEST, message: "Missing required data!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError({ statusCode: STATUS_CODES.BAD_REQUEST, message: "User with that email does not exist. Please enter a valid email!" });
    }

    const correctPassword = await user.isCorrectPassword(password);
    if (!correctPassword) {
        throw new ApiError({ statusCode: STATUS_CODES.UNAUTHORIZED, message: "Invalid credentials...!" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const { _id, name } = user;

    res
        .status(STATUS_CODES.OK)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        .json(new ApiResponse({
            statusCode: STATUS_CODES.OK,
            data: {
                user: { _id, name, email },
                token: accessToken
            },
            message: "User logged in successfully!"
        }));
});

const signOut = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError({ statusCode: STATUS_CODES.NOT_FOUND, message: "User not found." });
    }

    user.refreshToken = null;
    await user.save();

    res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(STATUS_CODES.OK)
        .json(new ApiResponse({
            statusCode: STATUS_CODES.OK,
            message: "User signed out successfully!"
        }));
});

const getProfileDetail = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError({ statusCode: STATUS_CODES.NOT_FOUND, message: "User not found" });
    }

    res.status(STATUS_CODES.OK).json(new ApiResponse({
        statusCode: STATUS_CODES.OK,
        data: user,
        message: "User profile fetched successfully"
    }));
});

const updateProfile = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true
    }).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError({ statusCode: STATUS_CODES.NOT_FOUND, message: "User not found" });
    }

    res.status(STATUS_CODES.OK).json(new ApiResponse({
        statusCode: STATUS_CODES.OK,
        data: updatedUser,
        message: "Profile updated successfully"
    }));
});

const deleteProfile = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new ApiError({ statusCode: STATUS_CODES.NOT_FOUND, message: "User not found" });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(STATUS_CODES.OK).json(new ApiResponse({
        statusCode: STATUS_CODES.OK,
        message: "User profile deleted successfully"
    }));
});

const renewAccessToken = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const userDetails = await User.findById(userId).select("+refreshToken");

    if (!userDetails?.refreshToken) {
        throw new ApiError({ statusCode: STATUS_CODES.UNAUTHORIZED, message: "Could not process the request!" });
    }

    const newAccessToken = await userDetails.generateAccessToken();

    res
        .status(STATUS_CODES.OK)
        .cookie("accessToken", newAccessToken, cookieOptions)
        .json(new ApiResponse({
            statusCode: STATUS_CODES.OK,
            data: { token: newAccessToken },
            message: "New token generated!"
        }));
});

module.exports = {
    signIn,
    signOut,
    signUp,
    getProfileDetail,
    updateProfile,
    deleteProfile,
    renewAccessToken
};
