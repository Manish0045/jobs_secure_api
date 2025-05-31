
const cookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "Strict"
}

const refreshTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 1000
}

const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

const ENV_VARIABLES = {
    PORT: process.env.PORT || 8000,

    MONGO_URI: process.env.MONGO_URI || "",
    DATABASE: process.env.DB_NAME || "",

    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1d",

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "30d"
};

if (ENV_VARIABLES.CORS_ORIGIN === undefined) {
    console.warn("CORS_ORIGIN is not defined. Falling back to '*'")
}

const REQUIRED_KEYS = [
    "MONGO_URI",
    "DB_NAME",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET"
];

const missing = REQUIRED_KEYS.filter(key => !process.env[key]);
if (missing.length > 0) {
    throw new Error(`Required environment variables missing: ${missing.join(", ")}`);
}

module.exports = {
    STATUS_CODES,
    ENV_VARIABLES,
    refreshTokenCookieOptions,
    cookieOptions
};
