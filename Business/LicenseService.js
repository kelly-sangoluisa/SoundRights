const LicenseRepository = require('../DataAccess/LicenseRepository');
 
class LicenseService {
  // Obtener todas las licencias
  static async getAllLicenses() {
    return await LicenseRepository.getAll();
  }
 
  // Obtener una licencia por ID
  static async getLicenseById(id_license) {
    return await LicenseRepository.getById(id_license);
  }
 
  // Crear una nueva licencia
  static async createLicense({ id_song, id_requester_user, status_license }) {
    console.log('LicenseService: creando licencia con:', { id_song, id_requester_user, status_license });
    return await LicenseRepository.create({ id_song, id_requester_user, status_license });
  }
 
  // Actualizar una licencia existente
  static async updateLicense(id_license, { id_song, id_requester_user, status_license, date_start_license, date_end_license }) {
    if (!id_song || !id_requester_user || !status_license) {
      throw new Error('Faltan datos obligatorios para la licencia.');
    }
    return await LicenseRepository.update(id_license, { id_song, id_requester_user, status_license, date_start_license, date_end_license });
  }
 
  // Eliminar una licencia
  static async deleteLicense(id_license) {
    return await LicenseRepository.delete(id_license);
  }
 
  // Obtener licencias por usuario solicitante
  static async getLicensesByRequesterUser(id_requester_user) {
    return await LicenseRepository.getByRequesterUserId(id_requester_user);
  }
 
  // Obtener licencias por canción
  static async getLicensesBySong(id_song) {
    return await LicenseRepository.getBySong(id_song);
  }
}
 
module.exports = LicenseService;