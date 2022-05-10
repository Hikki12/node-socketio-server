const express = require("express");
const morgan = require("morgan");
const socket = require("socket.io");
const path = require("path");

const { socketRouter } = require("./socket/config");

const app = express();
const port = 3000;

app.use(morgan("combined"));

// set static directories
const dir = path.join(__dirname, 'public', 'static');
app.use('/static', express.static(dir));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

const io = socket(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false
      }
});
socketRouter(io);
