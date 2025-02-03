const { User, Basket } = require("../models/model");
const ApiError = require("../error/apiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "4d" });
};
class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return next(ApiError.badRequest("Email ýa-da açar söz giriz!"));
      }
      const user = await User.findOne({ where: { email } });
      if (user) {
        next(ApiError.badRequest(`${email} email ulgamda hasaba alnan!`));
        return;
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const candidate = await User.create({
        email,
        role,
        password: hashPassword,
      });
      await Basket.create({ userId: candidate.id });

      const jsonwebt = generateJwt(candidate.id, email, user.role);

      return res.json({ jsonwebt });
    } catch (error) {
      console.log(error);

      next(ApiError.badRequest(error));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(ApiError.internal("Email ýa-da açar söz giriz!"));
      }
      const user = await User.findOne({ email });
      if (!user) {
        return next(ApiError.internal("Ulanyjy ulgamda tapylmady!"));
      }
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Açar söz nädogry!"));
      }
      const jsonwebt = generateJwt(user.id, user.email, user.role);
      return res.json({ user, jsonwebt });
    } catch (error) {
      return next(ApiError.badRequest(error));
    }
  }

  async check(req, res, next) {
    const { id } = req.query;
    if (!id) {
      return next(ApiError.badRequest("Ýalňyş id"));
    }
    res.json(id);
  }
  async getAll(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      return res.json({ message: "success", users });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
}
module.exports = new UserController();
