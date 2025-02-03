const {
  Product,
  Category,
  SubCategory,
  Segment,
  Status,
  Brand,
} = require("../models/model");
const ApiError = require("../error/apiError");
const sequelize = require("../database");
const { Op } = require("sequelize");

class ProductController {
  async create(req, res, next) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { productDetail } = req.body;
      const parsedProductDetails = JSON.parse(productDetail);

      // Required fields validation
      const requiredFieldsProduct = [
        "nameTm",
        "nameRu",
        "nameEn",
        "barcode",
        "categoryId",
        "subCategoryId",
        "statusId",
        "segmentId",
        "brandId",
        "sellPrice",
        "productQuantity",
      ];
      for (const field of requiredFieldsProduct) {
        if (!parsedProductDetails[field]) {
          return next(ApiError.badRequest(`${field} in product is required`));
        }
      }

      // Validate existence of related entities
      const checks = [
        {
          model: Category,
          id: parsedProductDetails.categoryId,
          name: "Kategoriýa",
        },
        {
          model: SubCategory,
          id: parsedProductDetails.subCategoryId,
          name: "Subkategoriýa",
        },
        { model: Segment, id: parsedProductDetails.segmentId, name: "Segment" },
        { model: Status, id: parsedProductDetails.statusId, name: "Status" },
        { model: Brand, id: parsedProductDetails.brandId, name: "Brand" },
      ];

      for (const check of checks) {
        const exists = await check.model.findByPk(check.id);
        if (!exists) {
          return next(ApiError.badRequest(`${check.name} tapylmady!`));
        }
      }

      const { imageOne, imageTwo, imageThree, imageFour, imageFive } =
        req.files || {};
      const imagePaths = {
        imageOne: imageOne?.[0]?.filename || null,
        imageTwo: imageTwo?.[0]?.filename || null,
        imageThree: imageThree?.[0]?.filename || null,
        imageFour: imageFour?.[0]?.filename || null,
        imageFive: imageFive?.[0]?.filename || null,
      };
      const hasAtLeastOneImage = Object.values(imagePaths).some(
        (filename) => filename !== null
      );

      if (!hasAtLeastOneImage) {
        return res
          .status(400)
          .json({ message: "At least one image is required." });
      }

      // Create the product
      const product = await Product.create(
        {
          nameTm: parsedProductDetails.nameTm,
          nameRu: parsedProductDetails.nameRu,
          nameEn: parsedProductDetails.nameEn,
          barcode: parsedProductDetails.barcode,
          categoryId: parsedProductDetails.categoryId,
          subCategoryId: parsedProductDetails.subCategoryId,
          segmentId: parsedProductDetails.segmentId,
          statusId: parsedProductDetails.statusId,
          brandId: parsedProductDetails.brandId,
          isActive: parsedProductDetails.isActive,
          descriptionTm: parsedProductDetails.descriptionTm,
          descriptionRu: parsedProductDetails.descriptionRu,
          descriptionEn: parsedProductDetails.descriptionEn,
          sellPrice: parsedProductDetails.sellPrice,
          incomePrice: parsedProductDetails.incomePrice,
          discount_priceTMT: parsedProductDetails.discount_priceTMT,
          discount_pricePercent: parsedProductDetails.discount_pricePercent,
          ...imagePaths, // Add image paths
          productQuantity: parsedProductDetails.productQuantity,
        },
        { transaction }
      );

      await transaction.commit();

      return res.status(201).json({
        product,
        message: "Product, colors, and sizes created successfully",
      });
    } catch (error) {
      await transaction.rollback(); // Rollback transaction on error
      console.error("Error creating product:", error);
      return next(
        ApiError.badRequest(`Failed to create product: ${error.message}`)
      );
    }
  }

  async updateProductDetails(req, res, next) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { productId, colorDetail } = req.body; // Extract productId and colorDetail from request body
      const parsedColorDetail = JSON.parse(colorDetail || "[]");

      // Validate input
      if (!productId) {
        return next(ApiError.badRequest("Product ID is required"));
      }
      if (!Array.isArray(parsedColorDetail) || parsedColorDetail.length === 0) {
        return next(
          ApiError.badRequest("Color detail must be a non-empty array")
        );
      }

      // Check if the product exists
      const product = await Product.findByPk(productId, { transaction });

      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      const imageUpdates = {
        imageOne:
          req.files?.imageOne?.[0]?.filename ||
          (product.imageOne === null ? null : product.imageOne),
        imageTwo:
          req.files?.imageTwo?.[0]?.filename === undefined ||
          req.files?.imageTwo?.[0]?.filename === null
            ? null
            : req.files?.imageTwo?.[0]?.filename || product.imageTwo,
        imageThree:
          req.files?.imageThree?.[0]?.filename === undefined ||
          req.files?.imageThree?.[0]?.filename === null
            ? null
            : req.files?.imageThree?.[0]?.filename || product.imageThree,
        imageFour:
          req.files?.imageFour?.[0]?.filename === undefined ||
          req.files?.imageFour?.[0]?.filename === null
            ? null
            : req.files?.imageFour?.[0]?.filename || product.imageFour,
        imageFive:
          req.files?.imageFive?.[0]?.filename === undefined ||
          req.files?.imageFive?.[0]?.filename === null
            ? null
            : req.files?.imageFive?.[0]?.filename || product.imageFive,
      };

      // Required fields for product details
      const requiredFields = [
        "nameTm",
        "nameRu",
        "nameEn",
        "barcode",
        "categoryId",
        "subCategoryId",
        "statusId",
        "segmentId",
        "brandId",
        "sellPrice",
      ];

      // Validate each color detail
      for (const detail of parsedColorDetail) {
        for (const field of requiredFields) {
          if (!detail[field]) {
            return next(
              ApiError.badRequest(
                `${field} is required in product color detail`
              )
            );
          }
        }
      }

      // Process updates for each detail
      for (const detail of parsedColorDetail) {
        await Product.update(
          {
            nameTm: detail.nameTm ?? product.nameTm,
            nameRu: detail.nameRu ?? product.nameRu,
            nameEn: detail.nameEn ?? product.nameEn,
            barcode: detail.barcode ?? product.barcode,
            categoryId: detail.categoryId ?? product.categoryId,
            subCategoryId: detail.subCategoryId ?? product.subCategoryId,
            segmentId: detail.segmentId ?? product.segmentId,
            statusId: detail.statusId ?? product.statusId,
            brandId: detail.brandId ?? product.brandId,
            isActive: detail.isActive ?? product.isActive,
            descriptionTm: detail.descriptionTm ?? product.descriptionTm,
            descriptionRu: detail.descriptionRu ?? product.descriptionRu,
            descriptionEn: detail.descriptionEn ?? product.descriptionEn,
            sellPrice: detail.sellPrice ?? product.sellPrice,
            incomePrice: detail.incomePrice ?? product.incomePrice,
            discount_priceTMT:
              detail.discount_priceTMT ?? product.discount_priceTMT,
            discount_pricePercent:
              detail.discount_pricePercent ?? product.discount_pricePercent,
            productQuantity: detail.productQuantity ?? product.productQuantity,
            ...imageUpdates, // Include image updates
          },
          {
            where: { id: productId },
            transaction,
          }
        );
      }

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({
        message: "Product details updated successfully",
      });
    } catch (error) {
      // Rollback on error
      await transaction.rollback();
      console.error("Error updating product details:", error);
      return next(
        ApiError.badRequest(
          `Failed to update product details: ${error.message}`
        )
      );
    }
  }

  async getAll(req, res, next) {
    try {
      const filter = {};
      const {
        categoryId,
        subCategoryId,
        segmentId,
        brandId,
        minPrice,
        maxPrice,
        nameTm,
        sortBy = "createdAt", // Default sorting by creation date
        sortOrder = "DESC", // Default descending order
        page = 1,
        limit = 10,
      } = req.query;

      const offset = (page - 1) * limit;

      const whereConditions = {};

      // Handle category filter
      if (categoryId) {
        whereConditions.categoryId = categoryId;
      }

      // Handle subCategory filter
      if (subCategoryId) {
        whereConditions.subCategoryId = subCategoryId;
      }
      if (segmentId) {
        whereConditions.segmentId = segmentId;
      }
      if (brandId) {
        whereConditions.brandId = brandId;
      }
      if (maxPrice || minPrice) {
        const priceCondition = [];
        if (maxPrice) {
          priceCondition.push({ [Op.lte]: maxPrice });
        }
        if (minPrice) {
          priceCondition.push({ [Op.gte]: minPrice });
        }
        filter.sellPrice = { [Op.and]: priceCondition };
      }

      // Handle name filter
      if (nameTm) {
        whereConditions.nameTm = {
          [Op.iLike]: `%${nameTm}%`,
        };
      }

      // Determine sorting options
      let order = [];
      if (sortBy === "alphabet") {
        order = [["nameTm", sortOrder]]; // Sorting alphabetically
      } else if (sortBy === "createdAt") {
        order = [["createdAt", sortOrder]]; // Sorting by creation date
      }

      // Count the total number of products matching the filters
      const countResult = await Product.count({
        where: whereConditions,

        distinct: true, // Ensure distinct products are counted
      });

      // Query the products with pagination and ordering
      const products = await Product.findAll({
        where: whereConditions,
        include: [
          {
            model: Category,
            as: "productCategory",
            // where: filter,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: SubCategory,
            as: "subCategory",
            // where: filter,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Brand,
            as: "brand",
            // where: filter,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Segment,
            as: "segment",
            // where: filter,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Status,
            as: "status",
            // where: filter,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        order,
        limit: parseInt(limit),
        offset,
      });

      // Return paginated results
      return res.status(200).json({
        totalItems: countResult,
        totalPages: Math.ceil(countResult / limit),
        currentPage: parseInt(page),
        products: products,
      });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }
  async getOne(req, res, next) {
    try {
      const { id, sortBy = "createdAt" } = req.query;

      if (!id) {
        return next(ApiError.badRequest("Id giriz!")); // "Enter ID!"
      }

      // Validate the product exists
      const productExist = await Product.findByPk(id);
      if (!productExist) {
        return next(ApiError.badRequest("Haryt tapylmady!")); // "Product not found!"
      }

      // Fetch product along with sizes
      const product = await Product.findOne({
        where: { id },

        attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclude timestamps
        order: [[sortBy, "ASC"]],
      });

      if (!product) {
        return next(ApiError.badRequest("Haryt tapylmady!")); // "Product not found!"
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
  async deleteProduct(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.query;

      const product = await Product.findByPk(id);
      if (!product) {
        return next(ApiError.badRequest("Product not found"));
      }

      await Product.destroy({ where: { id: id }, transaction });
      await transaction.commit();

      return res
        .status(200)
        .json({ message: "Product and color details deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting product:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
  async getProductsInBasket(req, res, next) {
    try {
      const { ids } = req.body; // Expecting an array of product IDs

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(ApiError.badRequest("ID-leri dogry giriziň!")); // "Enter valid IDs!"
      }

      // Fetch products based on the provided IDs
      const products = await Product.findAll({
        where: {
          id: ids,
        },
        attributes: [
          "id",
          "imageOne",
          "nameTm",
          "nameRu",
          "nameEn",
          "productQuantity",
          "sellPrice",
          "discount_priceTMT",
        ],
        // attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclude timestamps
        order: [["createdAt", "ASC"]],
      });

      if (!products.length) {
        return next(ApiError.badRequest("Haryt tapylmady!")); // "Products not found!"
      }

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new ProductController();
