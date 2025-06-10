const SongRepository = require('../DataAccess/SongRepository');

class SongService {
  // Obtener todas las canciones
  static async getAllSongs() {
    return await SongRepository.getAll();
  }

  // Obtener una canción por ID
  static async getSongById(id_song) {
    return await SongRepository.getById(id_song);
  }

  // Crear una nueva canción
  static async createSong({ id_user, title_song, file_url_song }) {
    // Aquí puedes agregar validaciones de negocio si lo necesitas
    if (!id_user || !title_song) {
      throw new Error('El usuario y el título de la canción son obligatorios.');
    }
    return await SongRepository.create({ id_user, title_song, file_url_song });
  }

  // Actualizar una canción existente
  static async updateSong(id_song, { id_user, title_song, file_url_song }) {
    // Validaciones de negocio si es necesario
    if (!id_user || !title_song) {
      throw new Error('El usuario y el título de la canción son obligatorios.');
    }
    return await SongRepository.update(id_song, { id_user, title_song, file_url_song });
  }

  // Eliminar una canción
  static async deleteSong(id_song) {
    return await SongRepository.delete(id_song);
  }
}

module.exports = SongService;