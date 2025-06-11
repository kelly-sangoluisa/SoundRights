class License {
  constructor(row) {
    this.id_license_request = row.id_license_request; // <-- nombre correcto
    this.id_song = row.id_song;
    this.id_requester_user = row.id_requester_user;
    this.status_license = row.status_license;
    this.date_start_license = row.date_start_license;
    this.date_end_license = row.date_end_license;
  }
}

module.exports = License;