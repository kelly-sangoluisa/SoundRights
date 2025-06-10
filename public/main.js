document.addEventListener('DOMContentLoaded', async () => {
  const marketTableBody = document.querySelector('.market-table tbody');
  if (marketTableBody) {
    try {
      const res = await fetch('/api/songs');
      const data = await res.json();
      if (data.success) {
        marketTableBody.innerHTML = data.songs.map(song => `
          <tr>
            <td>${song.title_song}</td>
            <td>${song.id_user}</td>
            <td>
              <a href="${song.file_url_song}" target="_blank">Ver archivo</a>
            </td>
            <td><button class="buy-btn" data-id="${song.id_song}">Comprar</button></td>
          </tr>
        `).join('');
      } else {
        marketTableBody.innerHTML = '<tr><td colspan="4">No hay canciones disponibles.</td></tr>';
      }
    } catch (err) {
      marketTableBody.innerHTML = '<tr><td colspan="4">Error al cargar canciones.</td></tr>';
    }
  }
});