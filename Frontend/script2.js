// --- Global Variables ---
let token = localStorage.getItem("token");
let senderId = localStorage.getItem("userId");
let currentReceiver = null;

// DOM Elements
const contactList = document.getElementById("contact-list");
const messageList = document.getElementById("messages");
const messageForm = document.getElementById("form");
const messageInput = document.getElementById("messageInput");
const profileName = document.getElementById("profileName");

// Load all contacts (excluding current user)
async function loadContacts() {
  try {
    const res = await fetch("/api/contact/contacts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await res.json();
    contactList.innerHTML = "";

    users.forEach((user) => {
      const div = document.createElement("div");
      div.textContent = user.name;
      div.classList.add("contact");
      div.style.cursor = "pointer";

      // On click of contact, load chat
      div.addEventListener("click", () => {
        currentReceiver = user;
        profileName.textContent = `Chat with ${user.name}`;
        loadMessages(user._id);
      });

      contactList.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to load contacts:", error);
    contactList.innerHTML = "<p>Error loading contacts</p>";
  }
}

// Load messages between sender and receiver
async function loadMessages(receiverId) {
  if (!senderId || !receiverId) return;

  try {
    const res = await fetch(`/api/messages/message/${senderId}/${receiverId}`);
    const messages = await res.json();

    messageList.innerHTML = "";

    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = `${msg.senderId === senderId ? "You" : currentReceiver.name}: ${msg.message}`;
      messageList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load messages:", error);
  }
}

// Send a new message
async function sendMessage(e) {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message || !currentReceiver) return;

  try {
    await fetch("/api/messages/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId,
        receiverId: currentReceiver._id,
        message,
      }),
    });

    messageInput.value = "";
    loadMessages(currentReceiver._id); // refresh chat
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

// Event listener
messageForm.addEventListener("submit", sendMessage);

// Initial Load
loadContacts();
