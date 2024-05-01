const mysql = require('mysql');
const dbconnection = require('../config/database');
const puppeteer = require('puppeteer');

const getInvoices = async () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM invoices";
        dbconnection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

const getInvoicesById = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM invoices WHERE id = ?";
        dbconnection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    })
}
const deleteInvoices = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM invoices WHERE id = ?";
        dbconnection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                if (results.affectedRows === 0) {
                    resolve(null);
                } else {
                    resolve(results);
                }
            }
        });
    });
};

const addInvoices = async (Data) => {
    const createdOn = new Date();

    return new Promise((resolve, reject) => {
        const query = "INSERT INTO invoices (invoice_number, store_id, total_amount, invoice_date, payment_due_date, payment_status, shipping_address, billing_address, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        dbconnection.query(query, [Data.invoice_number, Data.store_id, Data.total_amount, Data.invoice_date, Data.payment_due_date, Data.payment_status, Data.shipping_address, Data.billing_address, createdOn], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}
const updateInvoices = async (id, Data) => {
    const modified_on = new Date();

    return new Promise((resolve, reject) => {
        const query = "UPDATE invoices SET invoice_number = ?, store_id = ?, total_amount = ?, invoice_date = ?, payment_due_date = ?, payment_status = ?, shipping_address = ?, billing_address = ?, is_active = ? , modified_on = ? WHERE id = ?"
        dbconnection.query(query, [Data.invoice_number, Data.store_id, Data.total_amount, Data.invoice_date, Data.payment_due_date, Data.payment_status, Data.shipping_address, Data.billing_address, Data.is_active, modified_on, id], (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    })
}
const getInvoicesBill = async (id, res) => {
    try {
        const invoiceData = await getInvoicesById(id);

        // Render HTML template with invoice data
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 5px;
                    background: linear-gradient(135deg, #ffffff, #f0f0f0);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .invoice-info {
                    background: #f9f9f9;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .invoice-info p {
                    margin: 5px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                .highlight {
                    background-color: #e0f7fa;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Invoice</h2>
                </div>
                <div class="invoice-info">
                    <p>Invoice Number: <strong>${invoiceData.invoice_number}</strong></p>
                    <p>Store ID: <strong>${invoiceData.store_id}</strong></p>
                    <p>Invoice Date: <strong>${invoiceData.invoice_date}</strong></p>
                    <p>Payment Due Date: <strong>${invoiceData.payment_due_date}</strong></p>
                    <p>Payment Status: <strong>${invoiceData.payment_status}</strong></p>
                    <p>Shipping Address: <strong>${invoiceData.shipping_address}</strong></p>
                    <p>Billing Address: <strong>${invoiceData.billing_address}</strong></p>
                </div>
                <table>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                    <tr>
                        <td>Total Amount</td>
                        <td>${invoiceData.total_amount}</td>
                    </tr>
                    <tr class="highlight">
                        <td>Is Active</td>
                        <td>${invoiceData.is_active}</td>
                    </tr>
                </table>
                <div class="footer">
                    <p>Thank you for your business!</p>
                </div>
            </div>
        </body>
        </html>
        
        `;

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Set response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');

        // Send PDF buffer as response
        res.send(pdfBuffer);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error generating PDF invoice:', error);
        res.status(500).send('Error generating PDF invoice');
    }
};


module.exports = {
    getInvoices,
    getInvoicesById,
    deleteInvoices,
    addInvoices,
    updateInvoices,
    getInvoicesBill
}