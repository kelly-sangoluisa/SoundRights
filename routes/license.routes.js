const express = require('express');
const router = express.Router();
const LicenseService = require('../Business/LicenseService');

// GET /api/licenses - Listar todas las licencias
router.get('/api/licenses', async (req, res) => {
  try {
    const licenses = await LicenseService.getAllLicenses();
    res.json({ success: true, licenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;