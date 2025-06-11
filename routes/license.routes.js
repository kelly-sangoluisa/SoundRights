const express = require('express');
const router = express.Router();
const LicenseService = require('../Business/LicenseService');
 
// GET /api/licenses - Listar todas las licencias
router.get('/licenses', async (req, res) => {
  try {
    const licenses = await LicenseService.getAllLicenses();
    res.json({ success: true, licenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
router.post('/licenses', async (req, res) => {
  try {
    const { id_song, id_requester_user, status_license } = req.body;
    const license = await LicenseService.createLicense({ id_song, id_requester_user, status_license });
    res.json({ success: true, license });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
module.exports = router;