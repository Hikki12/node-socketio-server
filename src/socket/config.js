const routes = require("./routes");
const RoomsManager = require("./rooms");
var rooms = new RoomsManager();

const socketRouter = (server) => {

    server.on("connection", (client) => {
        console.log("welcome: ", client.id);

        client.on("disconnect", () => {
            console.log("Bye: ", client.id);

            if(client.isWeb){
                rooms.removeWebClient(client.room, client.id);
            }else{
                rooms.removeClient(client.room, client.id);
            }

            if(client.room){
                client.leave(client.room);
            }

            console.log("Rooms: ", rooms.get())
        });

        client.on(routes.JOIN_ROOM_WEB, (room) => {
            client.room = room;
            client.isWeb = true;
            client.join(room);
            rooms.addWebClient(room, client.id);
            console.log("Web client | Rooms: ", rooms.get())
        });

        client.on(routes.JOIN_ROOM_CLIENT, (room) => {
            client.room = room;
            client.isWeb = false;
            client.join(room);
            rooms.addClient(room, client.id);
            console.log("Client | Rooms: ", rooms.get())
        });


        client.on(routes.STREAM_CLIENT_SERVER, (frame) => {
            if(client.room){
                server.to(client.room).emit(routes.STREAM_SERVER_WEB, frame);   
            }
        })
    });



    console.log("configuring routes of socket...");
}

module.exports = { socketRouter };