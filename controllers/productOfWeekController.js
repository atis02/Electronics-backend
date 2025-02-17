const { Product, ProductOfWeek } = require("../models/model");
const ApiError = require("../error/apiError");

class ProductOfweekController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { productId, isActive } = req.body;

      // Проверка входных данных
      if (!productId) {
        return next(ApiError.badRequest("Haryt saýla!"));
      }
      const existProduct = await Product.findByPk(productId);
      if (!existProduct) {
        return next(ApiError.badRequest("Şeýle haryt ýok!"));
      }

      const productOfWeek = await ProductOfWeek.create({
        productId,
        isActive,
      });

      return res.json({ message: "Üstünlikli döredildi!", productOfWeek });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const productOfWeek = await ProductOfWeek.findAll({
        include: {
          model: Product,
          as: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }, // Use the correct alias
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      return res.json(productOfWeek);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const productOfWeek = await ProductOfWeek.findByPk(id);
      if (!productOfWeek) {
        return next(ApiError.badRequest("Haryt tapylmady"));
      }
      await productOfWeek.destroy();
      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk!"));
    }
  }
  async update(req, res, next) {
    try {
      const { id, productId, isActive } = req.body;

      const productOfWeek = await ProductOfWeek.findByPk(id);
      if (!productOfWeek) {
        return next(ApiError.badRequest("Hepde harydy tapylmady!"));
      }
      const existProduct = await Product.findByPk(productId);
      if (!existProduct) {
        return next(ApiError.badRequest("Haryt tapylmady!"));
      }
      // Обновляем текстовые поля, если они указаны
      if (!id || !productId) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }

      productOfWeek.productId = productId;
      productOfWeek.isActive = isActive;

      // Сохраняем изменения
      await productOfWeek.save();

      return res.json({ message: "Üstünlikli!", productOfWeek });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new ProductOfweekController();
