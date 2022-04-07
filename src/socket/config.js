const routes = require("./routes");

const socketRouter = (io) => {

    io.on("connect", (socket) => {
        console.log("welcome: ")
    });

    io.on("disconnect", (socket) => {
        console.log("Bye: ");
    });

    io.on(routes.STREAM_CLIENT_SERVER, (socket) => {
        socket.broadcast.emit(routes.STREAM_SERVER_WEB);
    })

    console.log("configuring routes of socket...");
}

module.exports = { socketRouter };