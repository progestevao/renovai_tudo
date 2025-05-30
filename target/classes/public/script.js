const chatbox    = document.getElementById("chatbox");
const mensagem   = document.getElementById("mensagem");

// guarda só as mensagens do usuário para contexto
let historicoUsuario = [];

// adiciona mensagem ao chat (usuário ou IA)
function adicionarMensagem(texto, autor = "RenovAI") {
  const wrapper = document.createElement("div");
  wrapper.className = "mb-4";

  // Mensagem do usuário
  if (autor === "Você") {
    wrapper.innerHTML = `<strong>Você:</strong> ${texto}`;
    chatbox.appendChild(wrapper);
  wrapper.classList.add('animate-fade-up');
    wrapper.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Detecta blocos numerados: 1. **Título**: descrição
  const regex = /(\d+)\.\s*\*\*(.*?)\*\*:\s*([\s\S]*?)(?=(\d+\.\s*\*\*|$))/g;
  const matches = [...texto.matchAll(regex)];

  // Se vier lista numerada, vamos:
  if (matches.length) {
    // 1) Exibir apenas o intro (texto antes do primeiro item)
    const idx = matches[0].index;
    const introText = texto.slice(0, idx).trim();
    const introDiv = document.createElement("div");
    introDiv.innerHTML = `<strong>🌿 RenovAI:</strong> <span class="text-gray-700">${introText.replace(/\n/g, "<br>")}</span>`;
    chatbox.appendChild(introDiv);
    introDiv.scrollIntoView({ behavior: "smooth" });

    // 2) Montar e exibir os cards
    const grid = document.createElement("div");
    grid.className = "grid gap-4 mt-4";

    matches.forEach((m, i) => {
      const titulo    = m[2].trim();
      const descricao = m[3].trim();
      const icone     = escolherIcone(titulo.toLowerCase());
      const card = document.createElement("div");
      card.className = `
        bg-green-50 border-l-4 border-green-400 p-4 rounded shadow-sm
        animate-fade-in-up
      `;
      card.style.animationDelay = `${i * 100}ms`;
      card.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
          <span class="text-green-600 text-xl">${icone}</span>
          <span class="font-semibold text-green-800">${titulo}</span>
        </div>
        <p class="text-gray-700 leading-relaxed">${descricao}</p>
      `;
      grid.appendChild(card);
    });

    chatbox.appendChild(grid);
    grid.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Se não houver lista numerada, exibo tudo puro
  const fallback = document.createElement("div");
  const formatted = texto
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n{2,}/g, "<br><br>")
    .replace(/\n/g, "<br>");
  fallback.innerHTML = `<strong>🌿 RenovAI:</strong> ${formatted}`;
  chatbox.appendChild(fallback);
  fallback.classList.add('animate-fade-up');
  fallback.scrollIntoView({ behavior: "smooth" });
}


// envia pergunta + histórico ao back
function enviar() {
  const texto = mensagem.value.trim();
  if (!texto) return;

  // mostra no front
  adicionarMensagem(texto, "Você");

  // guarda no histórico
  historicoUsuario.push(texto);
  mensagem.value = "";

  // placeholder “Digitando…”
  adicionarMensagem("<em class='text-gray-500'>Digitando...</em>");

// ... dentro de enviar():

fetch("https://renovai-tudo-1.onrender.com/perguntar", {

  method: "POST",
  headers: { "Content-Type": "application/json" },
  // envia sempre o array de perguntas para contexto
  body: JSON.stringify({ historico: historicoUsuario })
})
  method: "POST",
  headers: { "Content-Type": "application/json" },
  // envia sempre o array de perguntas para contexto
  body: JSON.stringify({ historico: historicoUsuario })
})

    .then(res => res.json())
    .then(data => {
      // remove "Digitando..."
      const last = chatbox.lastChild;
      if (last && last.innerText.includes("Digitando")) {
        chatbox.removeChild(last);
      }
      adicionarMensagem(data.resposta);
    })
    .catch(() => {
      const last = chatbox.lastChild;
      if (last && last.innerText.includes("Digitando")) {
        chatbox.removeChild(last);
      }
      adicionarMensagem("Erro ao se conectar com o servidor.");
    });
}

// limpa chat + histórico
function limpar() {
  chatbox.innerHTML = "";
  historicoUsuario = [];
}

// mapeia título em emoji
function escolherIcone(titulo) {
  if (titulo.includes("solar"))        return "☀️";
  if (titulo.includes("eólica"))       return "💨";
  if (titulo.includes("hidrelétrica")) return "💧";
  if (titulo.includes("biomassa"))      return "♻️";
  if (titulo.includes("geotérmica"))    return "🌋";
  return "🌿";
}

// Enter para enviar
mensagem.addEventListener("keydown", e => {
  if (e.key === "Enter") enviar();
});

// saudação inicial
window.addEventListener("DOMContentLoaded", () => {
  adicionarMensagem(
    "Olá! 👋<br>" +
    "Eu sou o RenovAI, seu assistente especialista em sustentabilidade e energias renováveis. " +
    "Como posso ajudar você hoje?",
    "RenovAI"
  );
});
