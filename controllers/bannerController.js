const {
  SubCategory,
  Category,
  Segment,
  Brand,
  Banner,
} = require("../models/model");
const ApiError = require("../error/apiError");

class BannerController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn } = req.body;
      const file = req.file;

      // Проверка входных данных
      if (!nameTm || !nameRu || !nameEn) {
        return next(ApiError.badRequest("Banner ady giriz!"));
      }

      // Проверяем, существует ли запись с таким nameTm
      const existingBanner = await Banner.findOne({
        where: { nameTm, nameRu, nameEn },
      });
      if (existingBanner) {
        return next(ApiError.badRequest("Bu banner eýýäm bar!"));
      }

      // Сохраняем файл
      let fileName = null;
      if (file) {
        fileName = file.filename;
      }

      // Создаем баннер
      const banner = await Banner.create({
        nameTm,
        nameRu,
        nameEn,
        image: fileName,
      });

      return res.json({ message: "Banner üstünlikli döredildi!", banner });
    } catch (e) {
      console.error(e);
      return next(ApiError.internal("Banner döretmekde ýalňyşlyk ýüze çykdy!"));
    }
  }

  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const banners = await Banner.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["nameTm", "ASC"]],
      });
      return res.json({ message: "success", banners });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const banner = await Banner.findByPk(id);
      if (!banner) {
        return next(ApiError.badRequest("Banner tapylmady"));
      }
      await banner.destroy();
      return res.json({ message: "Üstünlikli!" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk!"));
    }
  }
  async update(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn, id, isActive } = req.body;
      const file = req.file;

      // Проверяем наличие ID подкатегории
      const banner = await Banner.findByPk(id);
      if (!banner) {
        return next(ApiError.badRequest("Banner tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      banner.nameTm = nameTm;
      banner.nameRu = nameRu;
      banner.nameEn = nameEn;
      banner.isActive = isActive;

      // Обновляем изображение, если файл предоставлен
      if (file) {
        const fileName = file.filename;
        banner.image = fileName;
      }

      // Сохраняем изменения
      await banner.save();

      return res.json({ message: "Üstünlikli!", banner });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new BannerController();
