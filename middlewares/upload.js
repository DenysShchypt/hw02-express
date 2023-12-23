const multer = require("multer");
const path = require("path");

// Шлях до тимчасової папки
const tempDr = path.join(__dirname, "../", "temp");

// Object налаштувань
const multerConfig = multer.diskStorage({
    destination: tempDr,
    // Необов'язкова властивість для перейменування файлу
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

// Middleware яка зберігає файлв тимчасову папку temp
const upload = multer({
    storage: multerConfig
});

module.exports = upload;