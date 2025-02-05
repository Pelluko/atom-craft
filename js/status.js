async function obtenerEstadoServidor() {
    const url = "https://api.mcsrvstat.us/2/atomcraft.papu.host";
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.online) {
            document.getElementById("status").innerHTML = "🟢 Online";
            document.getElementById("players").innerHTML = `${datos.players.online} / ${datos.players.max}`;
            document.getElementById("version").innerHTML = datos.version || "Desconocida";
        } else {
            document.getElementById("status").innerHTML = "🔴 Offline";
            document.getElementById("players").innerHTML = "-";
            document.getElementById("version").innerHTML = "-";
        }
    } catch (error) {
        document.getElementById("status").innerHTML = "⚠️ Error al obtener datos";
    }
}

// Llamar a la función al cargar la página y refrescar cada 30 segundos
obtenerEstadoServidor();
setInterval(obtenerEstadoServidor, 30000);
