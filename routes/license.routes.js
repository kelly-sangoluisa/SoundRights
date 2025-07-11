const express = require('express');
const router = express.Router();
const LicenseService = require('../Business/LicenseService');
 
// GET /licenses?requester=ID
router.get('/licenses', async (req, res) => {
  try {
    const { requester, song } = req.query;
    let licenses;
    if (requester && !song) {
      licenses = await LicenseService.getLicensesByRequesterUser(requester);
    } else if (requester && song) {
      licenses = await LicenseService.getLicensesByUserAndSong(requester, song);
    } else {
      licenses = await LicenseService.getAllLicenses();
    }
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