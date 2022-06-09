const routes = require("./routes");
const RoomsManager = require("./rooms");
var rooms = new RoomsManager();


const socketRouter = (server) => {

    server.on("connection", (client) => {

        client.on("disconnect", () => {


            if(client.isWeb){
                rooms.removeWebClient(client.room, client.id);
            }else{
                rooms.removeClient(client.room, client.id);
            }

            if(client.room){
                client.leave(client.room);
            }
            
            if(!rooms.exists(client.room)){
                server.to(client.room).emit(routes.SERVER_STREAMER_SET_PAUSE_EXPERIMENT, true);
            }

            console.log("disconnected exits: ", rooms.exists(client.room));
            console.log("Client | Rooms: ", rooms.get())
        });

        client.on(routes.WEB_JOINS_ROOM_SERVER, (room) => {
            client.room = room;
            client.isWeb = true;
            client.join(room);
            rooms.addWebClient(room, client.id);
            console.log("Web client | Rooms: ", rooms.get());
            console.log("room exits: ", rooms.exists(room))
            if(rooms.exists(client.room)){
                server.to(client.room).emit(routes.SERVER_STREAMER_SET_PAUSE_EXPERIMENT, false)
            }
        });

        client.on(routes.EXPERIMENT_JOINS_ROOM_SERVER, (room) => {
            client.room = room;
            client.isWeb = false;
            client.join(room);
            rooms.addClient(room, client.id);
            console.log("Client | Rooms: ", rooms.get())
        });
        client.on(routes.WEB_REQUESTS_DATA_SERVER, () => {
            server.to(client.room).emit(routes.SERVER_REQUESTS_DATA_EXPERIMENT);
        })

        client.on(routes.WEB_SENDS_DATA_SERVER, (data) => {
            client.to(client.room).emit(routes.SERVER_SENDS_DATA_WEB, data);
            server.to(client.room).emit(routes.SERVER_SENDS_DATA_EXPERIMENT, data);
        });

        client.on(routes.EXPERIMENT_SENDS_DATA_SERVER, (data) => {
            server.to(client.room).emit(routes.SERVER_SENDS_DATA_WEB, data);
        });

        client.on(routes.EXPERIMENT_NOTIFIES_DATA_WERE_RECEIVED_SERVER, () => {
            server.to(client.room).emit(routes.SERVER_NOTIFIES_DATA_WERE_RECEIVED_WEB);
        });

        client.on(routes.WEB_NOTIFIES_DATA_WERE_RECEIVED_SERVER, () => {
            server.to(client.room).emit(routes.SERVER_NOTIFIES_DATA_WERE_RECEIVED_EXPERIMENT);
        });

        client.on(routes.EXPERIMENT_STREAMS_VIDEO_SERVER, (frame) => {
            if(client.room){
                // console.log('frame: ', typeof frame);
                server.to(client.room).emit(routes.SERVER_STREAMS_VIDEO_WEB, frame);   
            }
        });
    });



    console.log("configuring routes of socket...");
}

module.exports = { socketRouter };