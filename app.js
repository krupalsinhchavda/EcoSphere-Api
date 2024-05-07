const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 3000;


app.use(express.json());
const corsOptions = {
    // origin: '*', // Replace with the origin(s) you want to allow
    origin: '*', // Replace with the origin(s) you want to allow
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the HTTP methods you want to allow
    allowedHeaders: 'Content-Type,Authorization', // Specify the headers you want to allow
    credentials: true, // Allow cookies to be sent with the request (if needed)
    optionsSuccessStatus: 204, // Set the HTTP status code for successful preflight requests
};
app.use(cors(corsOptions));
app.use(bodyParser.json());


// // ROUTER NAVIGATION
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const productsRoutes = require('./routes/productsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');




// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});