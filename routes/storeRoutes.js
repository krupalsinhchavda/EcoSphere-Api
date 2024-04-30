const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const upload = require('../config/multerConfig');


router.post('/CreateStore', upload.single('image_url'), storeController.CreateStore);
router.delete('/DeleteStore/:id', storeController.DeleteStore);
router.get('/GetStore', storeController.GetStore);
router.put('/UpdateStore/:id', storeController.UpdateStore);
router.get('/GetStoreByID/:id', storeController.GetStoreByID);

module.exports = router;