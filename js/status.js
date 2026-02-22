// ===== ESTADO DEL SERVIDOR Y JUGADORES (Unificado y Corregido) =====
async function obtenerEstadoYJugadores() {
  // Consultamos la API de Java que contiene toda la info (info.clean y players.list)
  const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    const statusJavaEl = document.getElementById("status");
    const playersJavaEl = document.getElementById("players");
    const versionJavaEl = document.getElementById("version");
    const playerListContainerJava = document.getElementById("player-list-container");
    const playerListJava = document.getElementById("player-list");

    const statusBedrockEl = document.getElementById("status-bedrock");
    const playersBedrockEl = document.getElementById("players-bedrock");
    const versionBedrockEl = document.getElementById("version-bedrock");
    const playerListContainerBedrock = document.getElementById("player-list-bedrock-container");
    const playerListBedrock = document.getElementById("player-list-bedrock");

    if (!statusJavaEl || !statusBedrockEl) return;

    if (datos.online) {
      statusJavaEl.innerHTML = "🟢 Online";
      statusBedrockEl.innerHTML = "🟢 Online";

      const version = typeof datos.version === "string" ? datos.version : (datos.version && typeof datos.version.name === "string" ? datos.version.name : "Desconocida");
      versionJavaEl.textContent = version;
      versionBedrockEl.textContent = version;

      let javaCount = 0;
      let bedrockCount = 0;

      if (playerListJava && playerListBedrock) {
        playerListJava.innerHTML = "";
        playerListBedrock.innerHTML = "";

        // === 1. EXTRAER JUGADORES JAVA (Desde players.list) ===
        if (datos.players && Array.isArray(datos.players.list)) {
          datos.players.list.forEach((player) => {
            const nombre = typeof player === "string" ? player : player.name || "Jugador";
            // Si NO tiene punto, va a Java
            if (!nombre.startsWith(".")) {
              javaCount++;
              const li = document.createElement("li");
              // CORRECCIÓN AQUÍ: Se añadieron width y height fijos para evitar deformación
              li.innerHTML = `<img src="https://minotar.net/avatar/${encodeURIComponent(nombre)}/32.png" class="player-avatar" style="vertical-align: middle; margin-right: 8px; border-radius: 3px; width: 24px; height: 24px; object-fit: cover;"> <span>${nombre}</span>`;
              playerListJava.appendChild(li);
            }
          });
        }

        // === 2. EXTRAER JUGADORES BEDROCK (Desde la propiedad info.clean) ===
        if (datos.info && Array.isArray(datos.info.clean)) {
          datos.info.clean.forEach((linea) => {
            const nombre = linea.trim();
            // Si la línea de texto empieza con un punto, ¡es un jugador de Bedrock!
            if (nombre.startsWith(".")) {
              bedrockCount++;
              const nombreLimpio = nombre.replace(".", ""); // Quitamos punto para buscar su skin
              const li = document.createElement("li");
              // CORRECCIÓN AQUÍ: Se añadieron width y height fijos para evitar deformación
              li.innerHTML = `<img src="https://minotar.net/avatar/${encodeURIComponent(nombreLimpio)}/32.png" class="player-avatar" style="vertical-align: middle; margin-right: 8px; border-radius: 3px; width: 24px; height: 24px; object-fit: cover;"> <span>${nombre}</span>`;
              playerListBedrock.appendChild(li);
            }
          });
        }

        playerListContainerJava.style.display = javaCount > 0 ? "block" : "none";
        playerListContainerBedrock.style.display = bedrockCount > 0 ? "block" : "none";
      }

      // Actualizar contadores totales
      const maxCount = datos.players ? datos.players.max : 69;
      playersJavaEl.textContent = `${javaCount} / ${maxCount}`;
      playersBedrockEl.textContent = `${bedrockCount} / ${maxCount}`;

    } else {
      // Si está offline
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
    console.error("Error en la solicitud de estado:", error);
  }
}

// ===== MOTD GLOBAL =====
async function obtenerMotd() {
  const url = "https://api.mcstatus.io/v2/status/java/mc4.papu.host:20201";
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
  }
}

// ===== INICIALIZACIÓN GENERAL =====
document.addEventListener("DOMContentLoaded", () => {
  obtenerEstadoYJugadores();
  obtenerMotd();

  setInterval(obtenerEstadoYJugadores, 30000);
  setInterval(obtenerMotd, 30000);

  // Copiar IP
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
      fallbackCopy(ipText);
      showCopied();
    }
  });
});
