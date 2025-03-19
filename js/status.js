async function obtenerEstadoServidor() {
    const url = "http://199.127.60.172:20101/server/Atom-Craft/overview"; // API oficial

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.online) {
            document.getElementById("status").innerHTML = "🟢 Online";
            document.getElementById("players").innerHTML = `${datos.players.online} / ${datos.players.max}`;
            document.getElementById("version").innerHTML = datos.version || "Desconocida";

            // Mostrar lista de jugadores conectados si existen
            const playerListContainer = document.getElementById("player-list-container");
            const playerList = document.getElementById("player-list");
            playerList.innerHTML = ""; // Limpiar lista anterior

            if (datos.players.list && datos.players.list.length > 0) {
                datos.players.list.forEach(player => {
                    let li = document.createElement("li");

                    // Imagen de la skin del jugador
                    let img = document.createElement("img");
                    img.src = `https://minotar.net/avatar/${player}/32.png`; // 32px de tamaño
                    img.alt = `Skin de ${player}`;
                    img.classList.add("player-avatar"); // Añadir clase para estilos

                    // Nombre del jugador
                    let span = document.createElement("span");
                    span.textContent = ` ${player}`;

                    // Agregar la imagen y el nombre al <li>
                    li.appendChild(img);
                    li.appendChild(span);

                    // Agregar el elemento a la lista
                    playerList.appendChild(li);
                });
                playerListContainer.style.display = "block"; // Mostrar la lista
            } else {
                playerListContainer.style.display = "none"; // Ocultar si no hay jugadores
            }
        } else {
            document.getElementById("status").innerHTML = "🔴 Offline";
            document.getElementById("players").innerHTML = "-";
            document.getElementById("version").innerHTML = "-";
            document.getElementById("player-list-container").style.display = "none";
        }
    } catch (error) {
        document.getElementById("status").innerHTML = "⚠️ Error al obtener datos";
        console.error("Error en la solicitud de estado del servidor:", error);
    }
}

// Llamar a la función al cargar la página y refrescar cada 30 segundos
obtenerEstadoServidor();
setInterval(obtenerEstadoServidor, 30000);

// Función para copiar la IP del servidor
document.addEventListener("DOMContentLoaded", function () {
    const ipElement = document.getElementById("ip-servidor");
    const copyMessage = document.getElementById("copy-message");

    if (ipElement) {
        ipElement.addEventListener("click", function () {
            const ipText = ipElement.textContent.trim(); // Asegurar que el texto esté bien formateado

            // Intentar copiar usando la API moderna del portapapeles
            navigator.clipboard.writeText(ipText).then(() => {
                // Mostrar mensaje de copiado
                copyMessage.style.display = "block";
                setTimeout(() => {
                    copyMessage.style.display = "none";
                }, 2000);
            }).catch(err => {
                console.error("Error al copiar la IP:", err);
            });
        });
    }
});
