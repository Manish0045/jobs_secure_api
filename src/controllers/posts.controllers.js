const AsyncHandler = require("../middlewares/asyncHandler.middleware");


const createJob = AsyncHandler(async (req, res) => {

});

const getAllJob = AsyncHandler(async (req, res) => {

});

const getJobDetail = AsyncHandler(async (req, res) => {

});

const updateJobDetail = AsyncHandler((req, res) => {

});

const deleteJob = AsyncHandler((req, res) => {

});

module.exports = {
    createJob,
    getAllJob,
    getJobDetail,
    updateJobDetail,
    deleteJob
}