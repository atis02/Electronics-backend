const Router = require("express");
const auctionController = require("../controllers/auctionController");
const router = new Router();

router.post("/add", auctionController.create);
router.post("/join", auctionController.joinToAuction);
router.get("/all", auctionController.getAll);
router.post("/bidPrice", auctionController.updateAuctionPrice);
router.get("/getOne", auctionController.getAuctionById);
router.delete("/delete", auctionController.deleteAuction);
router.put("/update", auctionController.updateAuction);

module.exports = router;
