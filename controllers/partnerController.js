const {
  SubCategory,
  Category,
  Segment,
  Brand,
  Banner,
  Partner,
} = require("../models/model");
const ApiError = require("../error/apiError");

class PartnerController {
  // Create a new subcategory

  async create(req, res, next) {
    try {
      const { nameTm, nameRu, nameEn } = req.body;
      const file = req.file;

      // Проверка входных данных
      if (!nameTm || !nameRu || !nameEn) {
        return next(ApiError.badRequest("Partner ady giriz!"));
      }

      // Проверяем, существует ли запись с таким nameTm
      const existingPartner = await Partner.findOne({
        where: { nameTm, nameRu, nameEn },
      });
      if (existingPartner) {
        return next(ApiError.badRequest("Bu Partner eýýäm bar!"));
      }

      // Сохраняем файл
      let fileName = null;
      if (file) {
        fileName = file.filename;
      }

      // Создаем баннер
      const partner = await Partner.create({
        nameTm,
        nameRu,
        nameEn,
        image: fileName,
      });

      return res.json({ message: "Partner üstünlikli döredildi!", partner });
    } catch (e) {
      console.error(e);
      return next(
        ApiError.internal("Partner döretmekde ýalňyşlyk ýüze çykdy!")
      );
    }
  }

  // Get all subcategories with their parent categories
  async getAll(req, res, next) {
    try {
      const partner = await Partner.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [["nameTm", "ASC"]],
      });
      return res.json({ message: "success", partner });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query;

      const partner = await Partner.findByPk(id);
      if (!partner) {
        return next(ApiError.badRequest("partner tapylmady"));
      }
      await partner.destroy();
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
      const partner = await Partner.findByPk(id);
      if (!partner) {
        return next(ApiError.badRequest("partner tapylmady!"));
      }

      // Обновляем текстовые поля, если они указаны
      if (!nameTm || !nameRu || !nameEn || !id) {
        return next(ApiError.badRequest("Girizilen Maglumatlar ýalňyş!"));
      }
      partner.nameTm = nameTm;
      partner.nameRu = nameRu;
      partner.nameEn = nameEn;
      partner.isActive = isActive;

      // Обновляем изображение, если файл предоставлен
      if (file) {
        const fileName = file.filename;
        partner.image = fileName;
      }

      // Сохраняем изменения
      await partner.save();

      return res.json({ message: "Üstünlikli!", partner });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal("Ýalňyşlyk ýüze çykdy!"));
    }
  }
}

module.exports = new PartnerController();
