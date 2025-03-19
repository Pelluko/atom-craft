async function obtenerEstadoServidor() {
    const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host"; // API pública

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.online) {
            document.getElementById("status").innerHTML = "🟢 Online";
            document.getElementById("players").innerHTML = `${datos.players.online} / ${datos.players.max}`;
            document.getElementById("version").innerHTML = datos.version || "Desconocida";

            // Lista de jugadores conectados
            const playerList = document.getElementById("player-list");
            playerList.innerHTML = "";

            if (datos.players.list && datos.players.list.length > 0) {
                datos.players.list.forEach(player => {
                    let li = document.createElement("li");

                    let img = document.createElement("img");
                    img.src = `https://minotar.net/avatar/${player}/32.png`;
                    img.alt = `Skin de ${player}`;
                    img.classList.add("player-avatar");

                    let span = document.createElement("span");
                    span.textContent = ` ${player}`;

                    li.appendChild(img);
                    li.appendChild(span);
                    playerList.appendChild(li);
                });
                document.getElementById("player-list-container").style.display = "block";
            } else {
                document.getElementById("player-list-container").style.display = "none";
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

async function obtenerStatsPlan() {
    const url = "http://199.127.60.172:20101/api/server"; // API de PLAN

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        document.getElementById("players-24h").textContent = datos.players.unique24h;
        document.getElementById("uptime").textContent = (datos.tps["5m"] / 20 * 100).toFixed(2) + "%"; // Conversión TPS
        document.getElementById("tps").textContent = datos.tps["5m"] + " TPS";
        
    } catch (error) {
        console.error("Error al obtener datos de PLAN:", error);
        document.getElementById("estado-plan").textContent = "⚠️ Error al obtener estadísticas";
    }
}

// Copiar IP del servidor al portapapeles
document.addEventListener("DOMContentLoaded", function () {
    const ipElement = document.getElementById("ip-servidor");
    const copyMessage = document.getElementById("copy-message");

    ipElement.addEventListener("click", function () {
        navigator.clipboard.writeText(ipElement.textContent.trim()).then(() => {
            copyMessage.style.display = "block";
            setTimeout(() => { copyMessage.style.display = "none"; }, 2000);
        }).catch(err => {
            console.error("Error al copiar la IP:", err);
        });
    });
});

// Ejecutar funciones al cargar y actualizar cada 30 segundos
obtenerEstadoServidor();
obtenerStatsPlan();
setInterval(() => {
    obtenerEstadoServidor();
    obtenerStatsPlan();
}, 30000);


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
