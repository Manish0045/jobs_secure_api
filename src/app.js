const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const ApiResponse = require('./utils/apiResponse.handler');
const ApiError = require('./utils/apiError.handler');
const { STATUS_CODES, ENV_VARIABLES } = require('./utils/constants');

const app = express();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    legacyHeaders: false,
    standardHeaders: "draft-8",
    handler: (req, res, next) => {
        res.status(429).json(new ApiError({ statusCode: 429, message: "Too many requests...slow down!" }));
    }
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(cors({
    origin: ENV_VARIABLES.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.static("public"));

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(limiter);

app.get("/api/v1/health-check", (req, res) => {
    res.status(STATUS_CODES.OK).json(new ApiResponse(
        {
            statusCode: STATUS_CODES.OK,
            data: { STATUS: "OK" },
            message: "Working fine...!"
        }
    ));
});

const globalRoutes = require("./routes/global.routes");
app.use("/api/v1", globalRoutes);

app.use((req, res, next) => {
    res.status(STATUS_CODES.NOT_FOUND).json(new ApiError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Route Not Found!"
    }));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error!";

    console.error({ STATUS_CODE: statusCode, ERROR: message });
    res.status(statusCode).json(new ApiError(
        {
            statusCode: statusCode,
            message: message
        }
    ));
});

module.exports = app;
