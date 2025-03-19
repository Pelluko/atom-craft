async function obtenerEstadoServidor() {
    const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host"; 

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.online) {
            document.getElementById("status").innerHTML = "🟢 Online";
            document.getElementById("players").innerHTML = `${datos.players.online} / ${datos.players.max}`;
            document.getElementById("version").innerHTML = datos.version || "Desconocida";

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

// Copiar IP al portapapeles
document.querySelector(".copy-button").addEventListener("click", function () {
    navigator.clipboard.writeText(document.getElementById("ip-servidor").textContent.trim()).then(() => {
        alert("✅ IP copiada al portapapeles!");
    }).catch(err => {
        console.error("Error al copiar la IP:", err);
    });
});

// Ejecutar funciones
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
