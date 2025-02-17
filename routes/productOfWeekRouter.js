const Router = require("express");
const productOfWeekController = require("../controllers/productOfWeekController");
const router = new Router();

// router.patch("/update/subcategoryImg", upload.single("file"), subCategoryController.uploadCategoryImage)
router.post("/add", productOfWeekController.create);
router.get("/all", productOfWeekController.getAll);
router.delete("/remove", productOfWeekController.remove);
router.put("/update", productOfWeekController.update);

module.exports = router;
