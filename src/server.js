const express = require("express");
const morgan = require("morgan");
const socket = require("socket.io");

const { socketRouter } = require("./socket/config");

const app = express();
const port = 3000;

app.use(morgan("default"));

app.get('/', (req, res) => {
  res.send('Hello World!');
})

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

const io = socket(server);
socketRouter(io);
