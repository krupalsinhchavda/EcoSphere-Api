const invoiceService = require('../services/invoiceService');

const getInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getInvoices();
        res.status(200).json({
            meassage: "Get Invoice Succssfully",
            Data: invoices
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getInvoicesById = async (req, res) => {
    try {
        const id = req.params.id;
        const invoice = await invoiceService.getInvoicesById(id);

        if (invoice.length === 0) { 
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({
            message: "Get Invoice By Id Successfully",
            Data: invoice
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteInvoices = async (req, res) => {
    try {
        const id = req.params.id;
        const invoice = await invoiceService.deleteInvoices(id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const addInvoices = async (req, res) => {
    try {
        const { invoice_number, store_id, total_amount, invoice_date, payment_due_date, payment_status, shipping_address, billing_address } = req.body;
        const Data = {
            invoice_number,
            store_id,
            total_amount,
            invoice_date,
            payment_due_date,
            payment_status,
            shipping_address,
            billing_address
        }
        const invoice = await invoiceService.addInvoices(Data);
        res.status(201).json({
            message: "Invoice created successfully",
            data: invoice
        });

    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const updateInvoices = async (req, res) => {
    try {
        const id = req.params.id;
        const { invoice_number, store_id, total_amount, invoice_date, payment_due_date, payment_status, shipping_address, billing_address, is_active } = req.body;
        const Data = {
            invoice_number,
            store_id,
            total_amount,
            invoice_date,
            payment_due_date,
            payment_status,
            shipping_address,
            billing_address,
            is_active
        }
        const invoice = await invoiceService.updateInvoices(id, Data);
        if (invoice.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({
            message: "Invoice updated successfully",
            data: invoice
        });

    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const getInvoicesBill = async (req, res) => {
    try {
        const id = req.params.id;
        const invoice = await invoiceService.getInvoicesBill(id);

        if (invoice.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({
            message: "Invoices Bill Download successfully",
            data: invoice
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}


module.exports = {
    getInvoices,
    getInvoicesById,
    deleteInvoices,
    addInvoices,
    updateInvoices,
    getInvoicesBill
}