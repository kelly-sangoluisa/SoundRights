class License {
  constructor({ id_license, id_song, id_requester_user, status_license, date_start_license, date_end_license }) {
    this.id_license = id_license; // opcional, si tu tabla tiene PK autoincremental
    this.id_song = id_song;
    this.id_requester_user = id_requester_user;
    this.status_license = status_license;
    this.date_start_license = date_start_license;
    this.date_end_license = date_end_license;
  }
}

module.exports = License;