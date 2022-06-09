function arrayRemove(arr, value) {

    return arr.filter(function(ele){ 
        if(!arr || !ele){
            return null;
        }
        return ele != value; 
    });
}

class RoomsManager {
    constructor(){
       this.rooms = {}; 
    }

    clear(){
        this.rooms = []
    }

    get(){
        return this.rooms;
    }

    addWebClient(room, clientId){
        if(!room || !clientId){
            return null;
        }
        if(this.rooms[room]){
            if(this.rooms[room].web){
                this.rooms[room].web.push(clientId);
            }else{
                this.rooms[room].web = [clientId];
            }
        }else{
            this.rooms[room]= {}
            this.rooms[room].web = [clientId];
        }
    }

    addClient(room, clientId){
        if(!room || !clientId){
            return null;
        }
        if(this.rooms[room]){
            if(this.rooms[room].clients){
                this.rooms[room].clients.push(clientId);
            }else{
                this.rooms[room].clients = [clientId];
            }
        }else{
            this.rooms[room]= {}
            this.rooms[room].clients = [clientId];
        }
    }

    removeWebClient(room, clientId){
        if(!room || !clientId){
            return null;
        }
        if(this.rooms[room]){
            if(this.rooms[room].web){
                this.rooms[room].web = arrayRemove(this.rooms[room].web, clientId); 
            }
        }
    }

    removeClient(room, clientId){
        if(!room || !clientId){
            return null;
        }
        if(this.rooms[room]){
            if(this.rooms[room].clients){
                this.rooms[room].clients = arrayRemove(this.rooms[room].clients, clientId); 
            }
        }
    }

    exists(roomId){
        if(this.rooms[roomId]){
            return this.rooms[roomId].web.length > 0;
        }
        return false;
    }

    hasUsers(room){
        return this.rooms[room].length > 0;
    }
}

module.exports = RoomsManager;