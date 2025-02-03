const {
  Partner,
  Product,
  Auction,
  User,
  UserAuction,
} = require("../models/model");
const ApiError = require("../error/apiError");
const sequelize = require("../database");

class AuctionController {
  // Create a new subcategory

  async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const {
        productId,
        startDateAuction,
        endDateAuction,
        auctionProductPriceStart,
      } = req.body;
      console.log(auctionProductPriceStart);

      const product = await Product.findByPk(productId);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: "Product not found" });
      }
      const maxAuctionNumber = await Auction.max("auctionID", { transaction });
      const newAuctionNumber = (maxAuctionNumber || 0) + 1;

      const auction = await Auction.create(
        {
          productId,
          startDateAuction,
          auctionProductPriceCurrent: auctionProductPriceStart,
          endDateAuction,
          auctionProductPriceStart,
          auctionID: newAuctionNumber,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json(auction);
    } catch (error) {
      console.error(error);
      if (transaction) {
        await transaction.rollback();
      }

      res.status(500).json({ message: "Failed to create auction" });
    }
  }

  async joinToAuction(req, res) {
    try {
      const { userId, auctionId } = req.body;

      // Validate request input
      if (!userId || !auctionId) {
        return res
          .status(400)
          .json({ message: "userId and auctionId are required" });
      }

      // Fetch user and auction records
      const user = await User.findByPk(userId);
      const existAuction = await Auction.findByPk(auctionId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!existAuction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      // Check if user is already participating
      const userAlreadyHas = await UserAuction.findOne({
        where: { userId, auctionId },
      });

      if (userAlreadyHas) {
        return res
          .status(400)
          .json({ message: "User is already participating in this auction" });
      }

      // Add user to the auction
      const auctionParticipation = await UserAuction.create({
        auctionId,
        userId,
      });

      return res.status(201).json({
        message: "User successfully joined the auction",
        auctionParticipation,
      });
    } catch (error) {
      console.error("Error in joinToAuction:", error);
      return res.status(500).json({ message: "Failed to join the auction" });
    }
  }

  //   async getAll(req, res, next) {
  //     try {
  //       const auctions = await Auction.findAll({
  //         include: [
  //           {
  //             model: Product,
  //             as: "product",
  //             attributes: ["nameTm", "nameEn", "nameRu", "imageOne"],
  //           },
  //           {
  //             model: User,
  //             as: "participants",
  //             attributes: ["id", "email"], // Specify user fields to include
  //             through: { attributes: [] }, // Exclude the join table fields
  //           },
  //           {
  //             model: User,
  //             as: "lastBidder",
  //             attributes: ["id", "email"], // Include bidder info
  //           },
  //         ],
  //       });

  //       return res.status(200).json(auctions);
  //     } catch (error) {
  //       console.error("Error fetching auctions:", error);
  //       return next(ApiError.badRequest("Ýalňyşlyk!"));
  //     }
  //   }
  async getAll(req, res, next) {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    try {
      const offset = (page - 1) * limit;

      // Fetch auctions with pagination
      const auctions = await Auction.findAll({
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "nameTm", "nameEn", "nameRu", "imageOne"],
          },
          {
            model: User,
            as: "participants",
            attributes: ["id", "email"], // Specify user fields to include
            through: { attributes: [] }, // Exclude the join table fields
          },
          {
            model: User,
            as: "lastBidder",
            attributes: ["id", "email"], // Include bidder info
          },
        ],
        limit,
        offset,
      });

      // Fetch total count for pagination
      const totalCount = await Auction.count();

      return res.status(200).json({
        totalCount,
        page: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        auctions,
      });
    } catch (error) {
      console.error("Error fetching auctions:", error);
      return next(
        ApiError.badRequest("Error fetching auctions. Please try again later.")
      );
    }
  }

  async updateAuctionPrice(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { auctionId, userId, newPrice } = req.body;

      // Find auction
      const auction = await Auction.findByPk(auctionId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      if (!auction) {
        await transaction.rollback(); // Rollback in case auction is not found
        return res.status(404).json({ message: "Auction not found" });
      }

      // Find user
      const user = await User.findByPk(userId);
      if (!user) {
        await transaction.rollback(); // Rollback in case user is not found
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is a participant in the auction
      const isParticipant = await UserAuction.findOne({
        where: { userId, auctionId },
        transaction, // Transaction passed here
      });
      if (!isParticipant) {
        await transaction.rollback(); // Rollback in case user is not a participant
        return res.status(403).json({
          message: "You must join the auction before placing a bid.",
        });
      }

      // Check if auction has started
      const currentDateTime = new Date();
      const auctionStartDate = new Date(auction.startDateAuction);
      if (currentDateTime < auctionStartDate) {
        await transaction.rollback(); // Rollback if auction hasn't started
        return res
          .status(400)
          .json({ message: "Auction has not started yet." });
      }

      const auctionEndDate = new Date(auction.endDateAuction);
      if (currentDateTime > auctionEndDate) {
        await transaction.rollback(); // Rollback if auction has ended
        return res.status(400).json({ message: "Auction has already ended." });
      }

      // Validate price increase
      if (newPrice < 50) {
        await transaction.rollback(); // Rollback if price increase is invalid
        return res.status(400).json({
          message: `Your bid must be at least 50`,
        });
      }

      // Update auction price and last bidder
      auction.auctionProductPriceCurrent += newPrice;
      auction.lastBidderId = userId;
      await auction.save({ transaction }); // Save with transaction

      // Commit transaction if everything is successful
      await transaction.commit();

      return res.status(200).json({
        message: "Auction price updated successfully",
        auction,
        lastBidder: user.name || user.email, // Optional: return user info
      });
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();

      console.error("Error in updateAuctionPrice:", error);
      return res
        .status(500)
        .json({ message: "Failed to update auction price" });
    }
  }

  async getAuctionById(req, res, next) {
    const { auctionId } = req.query;

    try {
      const auction = await Auction.findByPk(auctionId, {
        include: [
          {
            model: Product,
            as: "product",
          },
          {
            model: User,
            as: "participants",
            attributes: ["id", "email"],
            through: { attributes: [] },
          },
          {
            model: User,
            as: "lastBidder",
            attributes: ["id", "email"],
          },
        ],
      });

      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      return res.status(200).json(auction);
    } catch (error) {
      console.error("Error fetching auction by ID:", error);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }

  // Delete an auction by ID
  async deleteAuction(req, res, next) {
    const { auctionId } = req.query;

    try {
      // Find the auction by ID
      const auction = await Auction.findByPk(auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      // Delete the auction
      await auction.destroy();
      return res.status(200).json({ message: "Auction deleted successfully" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Failed to delete auction"));
    }
  }

  // Update an auction by ID
  async updateAuction(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const {
        auctionId,
        productId,
        startDateAuction,
        endDateAuction,
        auctionProductPriceStart,
        auctionProductPriceCurrent,
      } = req.body;

      // Validate required fields
      if (
        !auctionId ||
        !startDateAuction ||
        !endDateAuction ||
        !auctionProductPriceStart ||
        !productId
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Find auction by ID
      const auction = await Auction.findByPk(auctionId, { transaction });
      if (!auction) {
        await transaction.rollback();
        return res.status(404).json({ message: "Auction not found" });
      }

      // Check if auction is already ended or started (you might want to prevent updates in such cases)
      const currentDate = new Date();
      const auctionStartDate = new Date(auction.startDateAuction);
      const auctionEndDate = new Date(auction.endDateAuction);

      if (currentDate > auctionEndDate) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Auction has already ended, cannot update." });
      }

      if (currentDate > auctionStartDate) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Auction has already started, cannot update." });
      }

      // Check if the new product exists
      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: "Product not found" });
      }

      // Proceed with updating the auction details
      auction.productId = productId; // Change product
      auction.startDateAuction = startDateAuction;
      auction.endDateAuction = endDateAuction;
      auction.auctionProductPriceStart = auctionProductPriceStart;
      auction.auctionProductPriceCurrent =
        auctionProductPriceCurrent || auction.auctionProductPriceCurrent;

      // Save the updated auction
      await auction.save({ transaction });

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({
        message: "Auction updated successfully",
        auction,
      });
    } catch (error) {
      console.error("Error updating auction:", error);

      if (transaction) {
        await transaction.rollback();
      }

      return res.status(500).json({ message: "Failed to update auction" });
    }
  }
}

module.exports = new AuctionController();
