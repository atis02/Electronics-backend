const Router = require("express");
const productController = require("../controllers/productController");
const router = new Router();

const multer = require("multer");
const path = require("path");

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
}).fields([
  { name: "imageOne", maxCount: 1 },
  { name: "imageTwo", maxCount: 1 },
  { name: "imageThree", maxCount: 1 },
  { name: "imageFour", maxCount: 1 },
  { name: "imageFive", maxCount: 1 },
]);

router.post("/add", upload, productController.create);
router.post("/addProperty", productController.createProperty);
router.get("/all", productController.getAll);
router.get("/getOne", productController.getOne);
router.delete("/remove", productController.deleteProduct);
router.delete("/removeProperty", productController.deleteProperty);
router.put("/update", upload, productController.updateProductDetails);
router.patch("/updateProperty", productController.updateProperty);
router.post("/basketProducts", upload, productController.getProductsInBasket);
router.get("/productProperties", productController.getProductProperty);

module.exports = router;
