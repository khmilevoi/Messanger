import io from "socket.io-client";

export const config = {
  port: 5050,
  host: "localhost"
};

let socket = io.connect(`http://${config.host}:${config.port}`);

socket.on("error", error => {
  socket = io.connect(`http://${config.host}:${config.port}`);
});

export default socket;
