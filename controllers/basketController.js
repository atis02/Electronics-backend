const {
  Status,
  Basket,
  User,
  Product,
  BasketProduct,
} = require("../models/model");
const ApiError = require("../error/apiError");

class BasketController {
  // async create(req, res, next) {
  //   try {
  //     const {
  //       userId,
  //       productId,
  //       productQuantity,
  //       price,
  //       imageOne,
  //      } = req.body;

  //     // Проверка входных данных
  //     if (!userId) {
  //       return next(ApiError.badRequest("Ulanyjy id giriz !"));
  //     }
  //     const userExist = User.findByPk(userId);
  //     if (userExist) {
  //       const basketExist = await Basket.findByPk();
  //       const basket = await Basket.create({
  //         userId,
  //       });
  //       if (
  //         ( !productId|| !productQuantity|| !price||!imageOne)
  //       ) {
  //         return res.status(404).json({ error: "Required fields!" });
  //       }
  //       // const basket = await Basket.findByPk(basketId);
  //       // if (!basket) {
  //       //   return res.status(404).json({ error: "Basket not found" });
  //       // }

  //       // Check if the product exists
  //       const product = await Product.findByPk(productId);
  //       if (!product) {
  //         return res.status(404).json({ error: "Product not found" });
  //       }
  //       // const price = productQuantity * product.sellPrice;

  //       // Create the BasketProduct
  //       const basketProduct = await BasketProduct.create({
  //         basketId:basket.id,
  //         productId,
  //         productQuantity,
  //         price,
  //         imageOne
  //       });
  //       return res.json({ message: "Sebet döredildi!", basket });
  //     } else {
  //       return next(ApiError.badRequest("Ulanyjy ulgamda ýok !"));
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     return next(ApiError.internal("Sebet döretmekde ýalňyşlyk ýüze çykdy!"));
  //   }
  // }
  async create(req, res, next) {
    try {
      const { userId, productId, productQuantity, imageOne } = req.body;

      if (!productId || !productQuantity || !imageOne) {
        return res.status(400).json({ error: "Required fields are missing!" });
      }

      // Check if the product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found!" });
      }

      // Check stock availability
      if (product.stock < productQuantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock. Available: ${product.stock}` });
      }

      let basket;

      // Fetch or create a basket for the user or guest
      if (userId) {
        const userExist = await User.findByPk(userId);
        if (!userExist) return next(ApiError.badRequest("User not found!"));

        basket =
          (await Basket.findOne({ where: { userId } })) ||
          (await Basket.create({ userId }));
      } else {
        basket = await Basket.create();
      }

      // Check if product already exists in the basket
      const existingBasketProduct = await BasketProduct.findOne({
        where: { basketId: basket.id, productId },
      });

      if (existingBasketProduct) {
        // Update the quantity, ensuring stock is not exceeded
        const newQuantity =
          existingBasketProduct.productQuantity + productQuantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({
            error: `Cannot add more than available stock. Available: ${product.stock}`,
          });
        }

        existingBasketProduct.productQuantity = newQuantity;
        await existingBasketProduct.save();
      } else {
        // Add a new product to the basket
        await BasketProduct.create({
          basketId: basket.id,
          productId,
          productQuantity,
          price: product.sellPrice, // Always get the latest price from Product
          imageOne,
        });
      }

      // Reduce stock in the product table
      product.stock -= productQuantity;
      await product.save();

      return res.json({ message: "Basket updated successfully!", basket });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal("Error creating basket!"));
    }
  }

  async add(req, res, next) {
    try {
      const { basketId, productId, productQuantity, price, imageOne } =
        req.body;

      if (!basketId || !productId || !productQuantity || !price || !imageOne) {
        return res.status(404).json({ error: "Required fields!" });
      }
      const basket = await Basket.findByPk(basketId);
      if (!basket) {
        return res.status(404).json({ error: "Basket not found" });
      }

      // Check if the product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const totalPrice = productQuantity * product.sellPrice;

      // Create the BasketProduct
      const basketProduct = await BasketProduct.create({
        basketId,
        productId,
        productQuantity,
        price,
        imageOne,
      });

      res.status(201).json({
        message: "Basket product added successfully",
        data: basketProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const status = await Basket.findAll({
        include: {
          model: BasketProduct,
          as: "basketProducts",
          //   attributes: [],
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        // order: [["nameTm", "ASC"]],
      });

      return res.json(status);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const status = await Status.findByPk(id);
      if (!status) {
        return next(ApiError.badRequest("status tapylmady"));
      }
      await status.destroy();
      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk!"));
    }
  }
  async update(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, id, isActive } = req.body;

      // Проверяем наличие ID подкатегории
      const status = await Status.findByPk(id);
      if (!status) {
        return next(ApiError.badRequest("status tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      status.nameTm = nameTm;
      status.nameRu = nameRu;
      status.nameEn = nameEn;
      status.isActive = isActive;

      // Обновляем изображение, если файл предоставлен

      // Сохраняем изменения
      await status.save();

      return res.json({ message: "Üstünlikli!", status });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new BasketController();
