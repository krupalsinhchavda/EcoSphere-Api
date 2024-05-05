const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import UUID module and its v4 method

// Function to create Folder if not exits
function CreateDirectory(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = uuidv4();

        let uploadFolder;
        if (req.originalUrl.includes('stores')) {
            uploadFolder = 'uploads/stores';
        }
        else if (req.originalUrl.includes('products')) {
            uploadFolder = 'uploads/products';
        }
        else {
            uploadFolder = 'uploads/profiles';
        }
        const userFolder = path.join(uploadFolder, userId);

        CreateDirectory(userFolder);

        cb(null, userFolder);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});


const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

module.exports = upload;
