async function obtenerEstadoServidor() {
  const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    // Si esta página no tiene esos elementos, salimos sin romper nada
    const statusEl = document.getElementById("status");
    const playersEl = document.getElementById("players");
    const versionEl = document.getElementById("version");
    const playerListContainer = document.getElementById("player-list-container");
    const playerList = document.getElementById("player-list");

    if (!statusEl || !playersEl || !versionEl) return;

    if (datos.online) {
      statusEl.textContent = "🟢 Online";
      playersEl.textContent = `${datos.players.online} / ${datos.players.max}`;
      versionEl.textContent = datos.version || "Desconocida";

      if (playerListContainer && playerList) {
        playerList.innerHTML = "";

        if (datos.players.list && datos.players.list.length > 0) {
          datos.players.list.forEach((player) => {
            const li = document.createElement("li");

            const img = document.createElement("img");
            img.src = `https://minotar.net/avatar/${player}/32.png`;
            img.alt = `Skin de ${player}`;
            img.classList.add("player-avatar");

            const span = document.createElement("span");
            span.textContent = ` ${player}`;

            li.appendChild(img);
            li.appendChild(span);
            playerList.appendChild(li);
          });

          playerListContainer.style.display = "block";
        } else {
          playerListContainer.style.display = "none";
        }
      }
    } else {
      statusEl.textContent = "🔴 Offline";
      playersEl.textContent = "-";
      versionEl.textContent = "-";
      if (playerListContainer) playerListContainer.style.display = "none";
    }
  } catch (error) {
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "⚠️ Error al obtener datos";
    console.error("Error en la solicitud de estado del servidor:", error);
  }
}

// Solo corre el “status” si existe el elemento #status (evita errores en otras páginas)
if (document.getElementById("status")) {
  obtenerEstadoServidor();
  setInterval(obtenerEstadoServidor, 30000);
}

// Copiar IP
document.addEventListener("DOMContentLoaded", () => {
  const ipElement = document.getElementById("ip-servidor");
  const copyMessage = document.getElementById("copy-message");

  if (!ipElement) return;

  const showCopied = () => {
    if (!copyMessage) return;
    copyMessage.style.display = "block";
    setTimeout(() => (copyMessage.style.display = "none"), 2000);
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  };

  ipElement.addEventListener("click", async () => {
    const ipText = ipElement.textContent.trim(); // "atomcraft.papu.host"

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(ipText);
      } else {
        fallbackCopy(ipText);
      }
      showCopied();
    } catch (err) {
      try {
        fallbackCopy(ipText);
        showCopied();
      } catch (e) {
        console.error("Error al copiar la IP:", err);
      }
    }
  });
});
