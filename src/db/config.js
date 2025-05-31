const mongoose = require('mongoose');
const { ENV_VARIABLES } = require('../utils/constants');

const connectDB = async () => {
    const MONGO_URI = ENV_VARIABLES.MONGO_URI;
    const DATABASE = ENV_VARIABLES.DATABASE;

    if (!MONGO_URI || !DATABASE) throw new Error("Database Parameters Missing!");
    try {
        const connectionInstance = await mongoose.connect(MONGO_URI, { maxPoolSize: 10, dbName: DATABASE });
        console.info("🗄️  Database connected successfully!");
        console.log(" HOST:", connectionInstance.connection.host);
    } catch (error) {
        console.error("Error connecting to Database!", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;