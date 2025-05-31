const router = require('express').Router();
const userRoutes = require('./users.routes');

router
    .use("/users", userRoutes)
// .use("/refferal", refferalRoutes)

module.exports = router
