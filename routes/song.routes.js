const express = require('express');
const router = express.Router();
const SongService = require('../Business/SongService');

// Obtener todas las canciones
router.get('/songs', async (req, res) => {
  try {
    const songs = await SongService.getAllSongs();
    res.json({ success: true, songs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener una canción por ID
router.get('/songs/:id', async (req, res) => {
  try {
    const song = await SongService.getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Canción no encontrada' });
    }
    res.json({ success: true, song });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Crear una nueva canción
router.post('/songs', async (req, res) => {
  try {
    const { id_user, title_song, file_url_song } = req.body;
    const newSong = await SongService.createSong({ id_user, title_song, file_url_song });
    res.status(201).json({ success: true, song: newSong });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Actualizar una canción existente
router.put('/songs/:id', async (req, res) => {
  try {
    const { id_user, title_song, file_url_song } = req.body;
    const updatedSong = await SongService.updateSong(req.params.id, { id_user, title_song, file_url_song });
    if (!updatedSong) {
      return res.status(404).json({ success: false, message: 'Canción no encontrada' });
    }
    res.json({ success: true, song: updatedSong });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Eliminar una canción
router.delete('/songs/:id', async (req, res) => {
  try {
    await SongService.deleteSong(req.params.id);
    res.json({ success: true, message: 'Canción eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;