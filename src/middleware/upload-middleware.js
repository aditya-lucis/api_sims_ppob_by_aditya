import multer from "multer";
import path from "path";

// Setup penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // pastikan folder ini ada
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Filter hanya jpeg/png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Format Image tidak sesuai"));
  } else {
    cb(null, true);
  }
};

// Middleware multer
export const upload = multer({
  storage,
  fileFilter,
});
