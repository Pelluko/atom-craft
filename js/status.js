// ===== ESTADO DEL SERVIDOR Y JUGADORES (Unificado) =====
// Hacemos una sola llamada a la API porque Geyser junta a todos los jugadores aquí.
async function obtenerEstadoYJugadores() {
  const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host:20201";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    // Elementos JAVA
    const statusJavaEl = document.getElementById("status");
    const playersJavaEl = document.getElementById("players");
    const versionJavaEl = document.getElementById("version");
    const playerListContainerJava = document.getElementById("player-list-container");
    const playerListJava = document.getElementById("player-list");

    // Elementos BEDROCK
    const statusBedrockEl = document.getElementById("status-bedrock");
    const playersBedrockEl = document.getElementById("players-bedrock");
    const versionBedrockEl = document.getElementById("version-bedrock");
    const playerListContainerBedrock = document.getElementById("player-list-bedrock-container");
    const playerListBedrock = document.getElementById("player-list-bedrock");

    if (!statusJavaEl || !statusBedrockEl) return;

    if (datos.online) {
      // Estado Online para ambos
      statusJavaEl.textContent = "🟢 Online";
      statusBedrockEl.textContent = "🟢 Online";

      // Versión (usamos la misma base)
      const version = typeof datos.version === "string" ? datos.version : (datos.version && typeof datos.version.name === "string" ? datos.version.name : "Desconocida");
      versionJavaEl.textContent = version;
      versionBedrockEl.textContent = version;

      let javaCount = 0;
      let bedrockCount = 0;

      if (playerListJava && playerListBedrock) {
        playerListJava.innerHTML = "";
        playerListBedrock.innerHTML = "";

        if (datos.players && Array.isArray(datos.players.list) && datos.players.list.length > 0) {
          datos.players.list.forEach((player) => {
            const nombre = typeof player === "string" ? player : player.name || "Jugador";
            const esBedrock = nombre.startsWith("."); // Identificamos si es de Bedrock
            
            const li = document.createElement("li");
            const img = document.createElement("img");
            
            // Le quitamos el punto al nombre para que Minotar pueda intentar buscar la skin
            const nombreLimpio = nombre.replace(".", "");
            img.src = `https://minotar.net/avatar/${encodeURIComponent(nombreLimpio)}/32.png`;
            img.alt = `Skin de ${nombre}`;
            img.classList.add("player-avatar");

            const span = document.createElement("span");
            span.textContent = ` ${nombre}`;

            li.appendChild(img);
            li.appendChild(span);

            // Filtramos a qué lista va
            if (esBedrock) {
              playerListBedrock.appendChild(li);
              bedrockCount++;
            } else {
              playerListJava.appendChild(li);
              javaCount++;
            }
          });
        }

        // Mostrar u ocultar contenedores de listas según si hay jugadores
        if (playerListContainerJava) playerListContainerJava.style.display = javaCount > 0 ? "block" : "none";
        if (playerListContainerBedrock) playerListContainerBedrock.style.display = bedrockCount > 0 ? "block" : "none";
      }

      // Actualizar los contadores de texto
      playersJavaEl.textContent = `${javaCount} / ${datos.players.max}`;
      playersBedrockEl.textContent = `${bedrockCount} / ${datos.players.max}`;

    } else {
      // Offline
      statusJavaEl.textContent = "🔴 Offline";
      statusBedrockEl.textContent = "🔴 Offline";
      playersJavaEl.textContent = "-";
      playersBedrockEl.textContent = "-";
      versionJavaEl.textContent = "-";
      versionBedrockEl.textContent = "-";
      if (playerListContainerJava) playerListContainerJava.style.display = "none";
      if (playerListContainerBedrock) playerListContainerBedrock.style.display = "none";
    }
  } catch (error) {
    if (document.getElementById("status")) document.getElementById("status").textContent = "⚠️ Error al obtener datos";
    if (document.getElementById("status-bedrock")) document.getElementById("status-bedrock").textContent = "⚠️ Error al obtener datos";
    console.error("Error en la solicitud de estado del servidor:", error);
  }
}

// ===== MOTD GLOBAL (usando HTML de mcstatus.io) =====
async function obtenerMotd() {
  const url = "https://api.mcstatus.io/v2/status/java/atomcraft.papu.host:20201";

  const motdEl = document.getElementById("motd-html");
  if (!motdEl) return;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.online || !data.motd || !data.motd.html) {
      motdEl.textContent = "Servidor Offline";
      return;
    }

    motdEl.innerHTML = data.motd.html;
  } catch (e) {
    motdEl.textContent = "Error cargando MOTD";
    console.error("MOTD error:", e);
  }
}

// ===== INICIALIZACIÓN GENERAL =====
document.addEventListener("DOMContentLoaded", () => {
  // Ejecutamos la función unificada
  obtenerEstadoYJugadores();
  setInterval(obtenerEstadoYJugadores, 30000);

  // MOTD global
  if (document.getElementById("motd-html")) {
    obtenerMotd();
    setInterval(obtenerMotd, 30000);
  }

  // Copiar IP (Java) - ¡Intacto!
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
    const ipText = ipElement.textContent.trim();

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
