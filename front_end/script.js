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
  msgDiv.className = cls === 'user' ? 'my-2 text-right' : 'my-2 text-left';
  msgDiv.textContent = `${sender}: ${text}`;
  document.getElementById("messages").appendChild(msgDiv);
}
function clearMessage(){
  const msgDiv = document.getElementById('messages')
  msgDiv.textContent = ''
}