const Router = require("express");
const multer = require("multer");
const router = new Router();
const path = require("path");
const bannerController = require("../controllers/bannerController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../static"));
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}_${file.originalname.replace(
      /\s+/g,
      "_"
    )}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// router.patch("/update/subcategoryImg", upload.single("file"), subCategoryController.uploadCategoryImage)
router.post("/add", upload.single("image"), bannerController.create);
router.get("/all", bannerController.getAll);
router.delete("/remove", bannerController.remove);
router.put("/update", upload.single("image"), bannerController.update);

module.exports = router;
