const app = require('./app');
const connectDB = require('./db/config');
const { ENV_VARIABLES } = require('./utils/constants');

async function startServer() {
    const PORT = ENV_VARIABLES.PORT;
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server started at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error Starting Server!", error.message);
        process.exit(1);
    }
}

startServer();