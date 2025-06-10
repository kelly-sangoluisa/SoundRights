const express = require('express');
const router = express.Router();
const LicenseService = require('../Business/LicenseService');

// Obtener licencias por usuario solicitante
router.get('/api/licenses/requester/:id_requester_user', async (req, res) => {
  try {
    const licenses = await LicenseService.getLicensesByRequesterUser(req.params.id_requester_user);
    res.json({ success: true, licenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;