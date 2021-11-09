const express = require("express");
const app = express();
const upload = require("express-fileupload");
const path = require("path");
const http = require("http");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.use(upload());

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server is online on port ${PORT}`));

io.on("connection", (socket) => {
  mails();
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("name", (name) => {
    socket.broadcast.emit("namee", name);
    console.log(name + " Joined the chat");
  });
  socket.on("chat message", (message) => {
    fs.appendFileSync(
      "./message.txt",
      '<div class="msgblock ' +
        message.name +
        '" style="background-color: hsl(' +
        message.color +
        ', 100%, 50%);">' +
        message.name +
        ": " +
        message.input +
        "</div>" +
        "\n"
    );
    mails();
  });
  socket.on("imagesender", (nameofusr) => {
    console.log(nameofusr);
    naam = nameofusr;

    app.post("/", (req, res) => {
      if (req.files) {
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);
        file.mv("./public/uploads/" + filename, function (err) {
          if (err) {
            res.send(err);
          } else {
            res.sendFile(__dirname + "/public/index.html");
            fs.appendFileSync(
              "./message.txt",
              '<img class="msgblock send-images ' +
                naam.name +
                '" style="background-color: hsl(' +
                naam.color +
                ', 100%, 50%);" src="./uploads/' +
                filename +
                '"> ' +
                "\n"
            );
            mails();
          }
        });
      }
    });
  });
});

let mails = () => {
  fs.readFile("./message.txt", "utf-8", (err, data) => {
    if (err) console.log(err);
    io.emit("data", data);
  });
};
