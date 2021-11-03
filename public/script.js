var socket = io();

random = () => {
  let y = Math.floor(Math.random() * (15 - 0)) + 0;
  let x = y*25;
  return x;
};
document.getElementById("welcome").innerHTML = "Welcome";
let name = prompt("Enter Your Name");
socket.emit("name", name);
var form = document.getElementById("form");
var input = document.getElementById("input");
socket.on("namee", (namee) => {
  document.getElementById("welcome").innerHTML = namee + " Joined the chat";
  document
    .getElementById("msgbox")
    .setAttribute("style", "border-radius: 2px 2px 2px 2px;");
});
let randomcolor = random()
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", { input: input.value, name: name, color: randomcolor});
    input.value = "";
    document.getElementById("welcome").innerHTML = "";
    document
      .getElementById("msgbox")
      .setAttribute("style", "border-radius: 30px 30px 2px 2px;");
  }
});
socket.on("data", (data) => {
  document.getElementById("welcome").innerHTML = "";
  document.getElementById("msgbox").innerHTML = data;
  document
    .getElementById("msgbox")
    .setAttribute("style", "border-radius: 30px 30px 2px 2px;");
});
