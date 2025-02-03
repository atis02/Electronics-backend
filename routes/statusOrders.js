const Router = require("express");
const subCategoryController = require("../controllers/subCategoryController");
const multer = require("multer");
const router = new Router();
const path = require("path");
const StatusOrdersController = require("../controllers/statusOrdersController");

router.post("/add", StatusOrdersController.create);
router.get("/all", StatusOrdersController.getAll);
router.delete("/remove", StatusOrdersController.remove);
router.put("/update", StatusOrdersController.update);

module.exports = router;
