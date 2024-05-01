const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/getInvoices', invoiceController.getInvoices);
router.get('/getInvoices/:id', invoiceController.getInvoicesById);
router.delete('/deleteInvoices/:id', invoiceController.deleteInvoices);
router.post('/addInvoices', invoiceController.addInvoices);
router.put('/updateInvoices/:id', invoiceController.updateInvoices);
router.get('/getInvoicesBill/:id', invoiceController.getInvoicesBill);

module.exports = router;