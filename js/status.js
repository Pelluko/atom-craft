// ===== JAVA EDITION =====
async function obtenerEstadoServidor() {
  const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    // Elementos del cuadro JAVA
    const statusEl = document.getElementById("status");
    const playersEl = document.getElementById("players");
    const versionEl = document.getElementById("version");
    const playerListContainer = document.getElementById("player-list-container");
    const playerList = document.getElementById("player-list");

    if (!statusEl || !playersEl || !versionEl) return;

    if (datos.online) {
      statusEl.textContent = "🟢 Online";
      if (datos.players) {
        playersEl.textContent = `${datos.players.online} / ${datos.players.max}`;
      } else {
        playersEl.textContent = "-";
      }

      // version puede ser string (v2) u objeto (v3)
      const version =
        typeof datos.version === "string"
          ? datos.version
          : datos.version && typeof datos.version.name === "string"
          ? datos.version.name
          : "Desconocida";
      versionEl.textContent = version;

      if (playerListContainer && playerList) {
        playerList.innerHTML = "";

        if (datos.players && Array.isArray(datos.players.list) && datos.players.list.length > 0) {
          datos.players.list.forEach((player) => {
            const nombre =
              typeof player === "string" ? player : player.name || "Jugador";

            const li = document.createElement("li");

            const img = document.createElement("img");
            img.src = `https://minotar.net/avatar/${encodeURIComponent(nombre)}/32.png`;
            img.alt = `Skin de ${nombre}`;
            img.classList.add("player-avatar");

            const span = document.createElement("span");
            span.textContent = ` ${nombre}`;

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
    console.error("Error en la solicitud de estado del servidor (Java):", error);
  }
}

// ===== BEDROCK EDITION =====
async function obtenerEstadoServidorBedrock() {
  const url = "https://api.mcsrvstat.us/bedrock/3/mc4.papu.host:20201";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    // Elementos del cuadro BEDROCK
    const statusEl = document.getElementById("status-bedrock");
    const playersEl = document.getElementById("players-bedrock");
    const versionEl = document.getElementById("version-bedrock");
    const playerListContainer = document.getElementById("player-list-bedrock-container");
    const playerList = document.getElementById("player-list-bedrock");

    if (!statusEl || !playersEl || !versionEl) return;

    if (datos.online) {
      statusEl.textContent = "🟢 Online";

      if (datos.players && typeof datos.players.online === "number") {
        playersEl.textContent = `${datos.players.online} / ${datos.players.max}`;
      } else {
        playersEl.textContent = "-";
      }

      const version =
        typeof datos.version === "string"
          ? datos.version
          : datos.version && typeof datos.version.name === "string"
          ? datos.version.name
          : "Desconocida";
      versionEl.textContent = version;

      if (playerListContainer && playerList) {
        playerList.innerHTML = "";

        if (datos.players && Array.isArray(datos.players.list) && datos.players.list.length > 0) {
          datos.players.list.forEach((player) => {
            const nombre =
              typeof player === "string" ? player : player.name || "Jugador";

            const li = document.createElement("li");

            const img = document.createElement("img");
            img.src = `https://minotar.net/avatar/${encodeURIComponent(nombre)}/32.png`;
            img.alt = `Skin de ${nombre}`;
            img.classList.add("player-avatar");

            const span = document.createElement("span");
            span.textContent = ` ${nombre}`;

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
    const statusEl = document.getElementById("status-bedrock");
    if (statusEl) statusEl.textContent = "⚠️ Error al obtener datos";
    console.error("Error en la solicitud de estado del servidor (Bedrock):", error);
  }
}

// Ejecutar Java si existe el cuadro Java
if (document.getElementById("status")) {
  obtenerEstadoServidor();
  setInterval(obtenerEstadoServidor, 30000);
}

// Ejecutar Bedrock si existe el cuadro Bedrock
if (document.getElementById("status-bedrock")) {
  obtenerEstadoServidorBedrock();
  setInterval(obtenerEstadoServidorBedrock, 30000);
}

// ===== Copiar IP (se mantiene igual) =====
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
