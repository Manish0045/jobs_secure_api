const jwt = require('jsonwebtoken');
const ApiError = require("../utils/apiError.handler");
const { User } = require('../models/users.model');
const { ENV_VARIABLES } = require('../utils/constants');

const Authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader);

        if (!token) {
            throw new ApiError(401, "Unauthorized Access!");
        }

        const decodedToken = jwt.verify(token, ENV_VARIABLES.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid access token!");
        }

        req.user = user;

        next();
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid access token!"));
    }
};

module.exports = Authenticate;
