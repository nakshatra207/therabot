const chat = document.getElementById("chat");

function send() {
  const input = document.getElementById("input");
  const msg = input.value.trim();
  if (!msg) return;

  chat.innerHTML += `<p><b>You:</b> ${msg}</p>`;
  chat.innerHTML += `<p id="typing"><i>Therabot is thinking...</i></p>`;
  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  fetch("http://localhost:3000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("typing").remove();
      chat.innerHTML += `<p><b>Therabot:</b> ${data.reply}</p>`;
      chat.scrollTop = chat.scrollHeight;
    });
}

