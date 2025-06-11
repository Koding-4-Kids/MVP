async function sendMessage() {
  const input = document.getElementById("user-input").value;
  if (!input.trim()) return;

  addMessage("You", input, "user");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });
  const data = await res.json();
  addMessage("Blossom", data.reply, "blossom");
  document.getElementById("user-input").value = "";
}

function addMessage(sender, text, cls) {
  const msgDiv = document.createElement("div");
  msgDiv.className = cls;
  msgDiv.textContent = `${sender}: ${text}`;
  document.getElementById("messages").appendChild(msgDiv);
}