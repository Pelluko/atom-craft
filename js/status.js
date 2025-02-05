async function obtenerEstadoServidor() {
    const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host";
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
                    li.textContent = `👤 ${player}`;
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
    }
}

// Llamar a la función al cargar la página y refrescar cada 30 segundos
obtenerEstadoServidor();
setInterval(obtenerEstadoServidor, 30000);
