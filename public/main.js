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
            <td>${song.artist_name || 'Desconocido'}</td>
            <td>
              ${song.file_url_song
                ? `<audio controls style="width:160px;">
                    <source src="${song.file_url_song}" type="audio/mpeg">
                    Tu navegador no soporta audio.
                  </audio>`
                : '<span style="color:#b0c3ce;">Sin archivo</span>'}
            </td>
            <td>
              <button class="buy-btn" data-id="${song.id_song}">Adquirir Derechos</button>
            </td>
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