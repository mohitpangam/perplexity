import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { createServer } from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT;

const httpServer = createServer(app);

initSocket(httpServer);

connectDB();

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


