document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const form = document.querySelector("form");
  const input = document.querySelector("input");
  const messages = document.querySelector("#messages");
  const usersList = document.querySelector("#users-list");
  const userColors = ["#FF5733", "#33FF57", "#3357FF", "#FF3399", "#99FF33"];
  const messagesBox = document.querySelector(".messages-box");
  const inputField = document.querySelector(".fixed-bottom");
  // Request permission for notifications
  // Notification.requestPermission().then(function (permission) {
  //   if (permission === "granted") {
  //     console.log("Notification permission granted.");
  //   } else {
  //     console.error("Unable to get permission to notify.");
  //   }
  // });
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

  // Function to reset the title
  function resetTitle() {
    document.title = "Chat & Furkan Gönülal"; // Replace "Original Title" with your original tab title
  }

  // Reset the title after 5 seconds
  setTimeout(resetTitle, 5000);

  // Reset the title when the user clicks on the tab
  window.addEventListener("focus", resetTitle);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
      let val = input.value;
      input.value = "";
      socket.emit("chat message", val);
      val = "";
    }
  });

  socket.on("chat message", (data) => {
    const item = document.createElement("li");
    item.classList.add("list-group-item"); // Add Bootstrap class for styling
    item.classList.add("mt-2");
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

    document.title = "New message!";
    setTimeout(resetTitle, 5000);

    // Create a new notification
   
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

  // Assuming each user item is created like this:

  // Make the user's name clickable
  usersList.addEventListener("click", () => {
    console.log("clickk");
    const newName = prompt("Enter your new name:");
    if (newName) {
      // Send a request to the server to update the user's name
      // Include the user's ID along with the new name
      socket.emit("change name", { id: socket.id, newName });
    }
  });
});
