var socket = io();
random = () => {
  let y = Math.floor(Math.random() * (18 - 0)) + 0;
  let x = y * 20;
  if (x == 40 || x == 60) {
    x = 220;
  }
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
let randomcolor = random();
form.addEventListener("submit", function (e) {
  e.preventDefault();
  input.focus();
  scrollupdate()
  if (input.value) {
    socket.emit("chat message", {
      input: input.value,
      name: name,
      color: randomcolor,
    });
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
  scrollupdate()
  document
    .getElementById("msgbox")
    .setAttribute("style", "border-radius: 30px 30px 2px 2px;");
  let you = document.getElementsByClassName(name);
  for (let i = 0; i < you.length; i++) {
    you[i].setAttribute(
      "style",
      "float:right;background-color:hsl(" + randomcolor + ", 100%, 50%);border-radius: 80px 2px 80px 80px;"
    );
  }
});
let scrollupdate=()=>{
var myDiv = document.getElementById("msgbox");
myDiv.scrollTop = myDiv.scrollHeight;
}

scrollupdate()