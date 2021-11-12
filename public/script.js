var socket = io();
var name = prompt("Enter Your Name");
var form = document.getElementById("form");
var input = document.getElementById("input");
var clip = document.getElementById("clip");
var send = document.getElementById("send");
var file = document.getElementById("file");
var imgform = document.getElementById("imgform");
var dark = document.getElementById("darkmode");
var msgbox = document.getElementById("msgbox");
document.getElementById("welcome").innerHTML = "Welcome";

random = () => {
  let y = Math.floor(Math.random() * (18 - 0)) + 0;
  let x = y * 20;
  if (x == 40 || x == 60) {
    x = 220;
  }
  return x;
};
let randomcolor = random();

socket.on("namee", (namee) => {
  document.getElementById("welcome").innerHTML = namee + " Joined the chat";
  document
    .getElementById("msgbox")
    .setAttribute("style", "border-radius: 2px 2px 2px 2px;");
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  input.focus();
  scrollupdate();
  clip.style.display = "inline";
  send.style.display = "none";
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
  scrollupdate();
  document
    .getElementById("msgbox")
    .setAttribute("style", "border-radius: 30px 30px 2px 2px;");
  let you = document.getElementsByClassName(name);
  for (let i = 0; i < you.length; i++) {
    you[i].setAttribute(
      "style",
      "float:right;background-color:hsl(" +
        randomcolor +
        ", 100%, 50%);border-radius: 80px 2px 80px 80px;"
    );
  }
});
let scrollupdate = () => {
  var myDiv = document.getElementById("msgbox");
  myDiv.scrollTop = myDiv.scrollHeight;
};
input.addEventListener("keydown", function () {
  if (input.value == "") {
    clip.style.display = "inline";
    send.style.display = "none";
  } else {
    clip.style.display = "none";
    send.style.display = "inline";
  }
});
file.onchange = () => {
  socket.emit("imagesender", {
    name: name,
    color: randomcolor,
  });
  const selectedFile = file.files[0];
  if (selectedFile) {
    imgform.submit();
    file.value = null;
  }
};

let darkmode = () => {
  if (dark.innerHTML == 'Dark Mode <img src="Darkmode.png">') {
    dark.innerHTML = 'Light Mode <img src="Darkmode.png">';
    msgbox.classList.replace("msgbox", "msgbox-dark");
    document.body.style.backgroundColor = "rgb(0, 28, 65)";
    dark.style.display = "none";
  } else {
    dark.innerHTML = 'Dark Mode <img src="Darkmode.png">';
    msgbox.classList.replace("msgbox-dark", "msgbox");
    document.body.style.backgroundColor = "rgb(0, 110, 255)";
    dark.style.display = "none";
  }
};
let showopt = () => {
  dark.style.display !== "block"
    ? (dark.style.display = "block")
    : (dark.style.display = "none");
};
scrollupdate();
window.onload = scrollupdate()
