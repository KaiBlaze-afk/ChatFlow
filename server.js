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
    socket.broadcast.emit('disconnected');
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
        let ext = filename.split(".").pop();
        file.mv("./public/uploads/" + filename, function (err) {
          if (err) {
            res.send(err);
          } else {
            res.sendFile(__dirname + "/public/index.html");
            if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "gif") {
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
            } else if (ext == "mp4" || ext == "webm" || ext == "mkv") {
              fs.appendFileSync(
                "./message.txt",
                '<video class="msgblock send-video ' +
                  naam.name +
                  '" style="background-color: hsl(' +
                  naam.color +
                  ', 100%, 50%);" controls><source src="./uploads/' +
                  filename +
                  '" type="video/' +
                  ext +
                  '"></video>' +
                  "\n"
              );
            } else if (ext == "mp3" || ext == "wav") {
              fs.appendFileSync(
                "./message.txt",
                '<video class="msgblock send-audio ' +
                  naam.name +
                  '" style="background-color: hsl(' +
                  naam.color +
                  ', 100%, 50%);" controls><source src="./uploads/' +
                  filename +
                  '" type="audio/' +
                  ext +
                  '"></video>' +
                  "\n"
              );
            } else if (
              ext == "pdf" ||
              ext == "txt" ||
              ext == "html" ||
              ext == "apk" ||
              ext == "db"
            ) {
              fs.appendFileSync(
                "./message.txt",
                '<a download class="msgblock sendfile ' +
                  naam.name +
                  '" style="background-color: hsl(' +
                  naam.color +
                  ', 100%, 50%);" href="./uploads/' +
                  filename +
                  '">' +
                  "&#8681; " +
                  filename +
                  "</a>" +
                  "\n"
              );
            } else {
              fs.appendFileSync(
                "./message.txt",
                '<div class="msgblock unsupported ' +
                  naam.name +
                  '" style="background-color: hsl(' +
                  naam.color +
                  ', 100%, 50%);">' +
                  naam.name +
                  ": File Format Not Supported</div>" +
                  "\n"
              );
            }
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
