const Router = require("express");
const router = new Router();
const UserController = require("../controllers/userController");
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
});

router.post(
  "/registration",
  upload.single("image"),
  UserController.registration
);
router.post("/login", UserController.login);
router.get("/auth", UserController.check);
router.get("/allUsers", UserController.getAll);

router.post("/loginAdminPage", UserController.loginToAdminPage);
router.post("/registerAdminPage", UserController.registrationForAdminPage);
router.get("/allUsersAdminPage", UserController.getAllAdminPageUsers);

module.exports = router;
