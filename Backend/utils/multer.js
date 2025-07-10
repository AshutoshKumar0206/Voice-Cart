const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folders exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Create a configured multer instance
 * @param {string} folder - The upload destination (e.g. 'uploads/products')
 */
const createMulterInstance = (folder) => {
  ensureDirExists(folder);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const uniqueName = `${baseName}-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  });

  return multer({ storage });
};

module.exports = createMulterInstance;
