const socket = io("http://localhost:8000");

//Get DOM elements in js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

//Audio plays on receiving message
var audio = new Audio("ting.mp3");

//function to append event info on screen
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

//If form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

//Ask user for his/her name
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

//If new user joins
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

//Message received
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

//User leaves
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});
