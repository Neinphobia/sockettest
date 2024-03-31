document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const messages = document.querySelector("#messages");
  const usersList = document.querySelector("#users-list");
  const userColors = ["#FF5733", "#33FF57", "#3357FF", "#FF3399", "#99FF33"];
  const messagesBox = document.querySelector(".messages-box");
  const inputField = document.querySelector(".fixed-bottom");

  window.addEventListener("resize", function () {
    // Check if the keyboard is open
    if (window.innerHeight < window.screen.height) {
      // Calculate the new height for the messages box
      // Subtract the height of the input field and any additional space you want to leave
      const newHeight = window.innerHeight - inputField.offsetHeight - 20; // 20px is an example, adjust as needed
      messagesBox.style.height = newHeight + "px";
    } else {
      // Reset the height of the messages box when the keyboard is closed
      messagesBox.style.height = "80vh"; // Reset to the original height
    }
  });
  messagesBox.scrollTop = messagesBox.scrollHeight;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        let val = input.value 
        input.value = "";
        socket.emit("chat message", val);
        val="";
    }
  });

  socket.on("chat message", (data) => {
    const item = document.createElement("li");
    item.classList.add("list-group-item"); // Add Bootstrap class for styling
    item.textContent = data.sillyName + " : " + data.msg;

    // Determine if the message is even or odd
    const isEven = messages.children.length % 2 === 0;
    if (isEven) {
      item.classList.add("message-even");
    } else {
      item.classList.add("message-odd");
    }

    messages.appendChild(item);
    // Scroll to the bottom of the messages box
    messagesBox.scrollTop = messagesBox.scrollHeight;
  });

  socket.on("users list", (users) => {
    usersList.innerHTML = "";
    users.forEach((user) => {
      const userItem = document.createElement("li");

      userItem.classList.add("list-group-item"); // Add Bootstrap class for styling

      userItem.textContent = user.name;

      usersList.appendChild(userItem);
    });
  });
});
