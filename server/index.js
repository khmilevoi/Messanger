const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const router = require("./router");

const path = require("path");

const PORT = process.env.PORT || 5050;

const app = express();
app.use("/Files", express.static(path.join(__dirname + "/Files")));

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", socket => router(socket, io));

server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
