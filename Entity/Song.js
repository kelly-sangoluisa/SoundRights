class Song {
  constructor({ id_song, id_user, title_song, file_url_song }) {
    this.id_song = id_song;
    this.id_user = id_user;
    this.title_song = title_song;
    this.file_url_song = file_url_song;
  }
}

module.exports = Song;