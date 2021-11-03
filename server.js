const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server is online on port ${PORT}`));

io.on("connection", (socket) => {
  mails();
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("name", (name) => {
    socket.broadcast.emit("namee", name);
    console.log(name);
  });
  socket.on("chat message", (message) => {
    fs.appendFileSync(
      "./message.txt",
      '<div class="msgblock" style="color: hsl(' +
        message.color +
        ', 100%, 30%);">' +
        message.name +
        ": " +
        message.input +
        "</div>" +
        "\n"
    );
    mails();
  });
});

mails = () => {
  fs.readFile("./message.txt", "utf-8", (err, data) => {
    if (err) console.log(err);
    io.emit("data", data);
  });
};
