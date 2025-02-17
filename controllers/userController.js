const { User, Basket, UserForAdminPage } = require("../models/model");
const ApiError = require("../error/apiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "4d" });
};
class UserController {
  // async registration(req, res, next) {
  //   try {
  //     const { email, password, role } = req.body;

  //     if (!email || !password) {
  //       return next(ApiError.badRequest("Email ýa-da açar söz giriz!"));
  //     }
  //     const user = await User.findOne({ where: { email } });
  //     if (user) {
  //       next(ApiError.badRequest(`${email} email ulgamda hasaba alnan!`));
  //       return;
  //     }
  //     const hashPassword = await bcrypt.hash(password, 3);
  //     const candidate = await User.create({
  //       email,
  //       role,
  //       password: hashPassword,
  //     });
  //     await Basket.create({ userId: candidate.id });

  //     const jsonwebt = generateJwt(candidate.id, email, user.role);

  //     return res.json({ jsonwebt });
  //   } catch (error) {
  //     console.log(error);

  //     next(ApiError.badRequest(error));
  //   }
  // }
  async registration(req, res, next) {
    try {
      const { email, password, role, phoneNumber, name, surname } = req.body;
      const file = req.file;

      if (!email || !password || !phoneNumber || !name || !surname) {
        return next(ApiError.badRequest("Maglumaltlary giriz!"));
      }

      // Check if the email is already registered
      const user = await User.findOne({ where: { phoneNumber } });
      if (user) {
        return next(
          ApiError.badRequest(`${phoneNumber} belgi ulgamda hasaba alnan!`)
        );
      }

      // Hash the password before storing it
      const hashPassword = await bcrypt.hash(password, 3);
      let fileName = null;
      if (file) {
        fileName = file.filename;
      }
      // Create user and basket
      const candidate = await User.create({
        email,
        role,
        password: hashPassword,
        phoneNumber,
        name,
        surname,
        image: fileName,
      });

      // await Basket.create({ userId: candidate.id });

      // Ensure the role is correctly passed from the candidate
      const jsonwebt = generateJwt(
        candidate.id,
        candidate.email,
        candidate.role
      );

      return res.status(201).json({ token: jsonwebt });
    } catch (error) {
      console.error(error);
      next(ApiError.badRequest("Something went wrong during registration"));
    }
  }
  async registrationForAdminPage(req, res, next) {
    try {
      const { password, role, phoneNumber, name } = req.body;

      if (!password || !phoneNumber || !name || !role) {
        return next(ApiError.badRequest("Maglumaltlary giriz!"));
      }

      // Check if the phoneNumber is already registered
      const user = await UserForAdminPage.findOne({ where: { phoneNumber } });
      if (user) {
        return next(
          ApiError.badRequest(`${phoneNumber} belgi ulgamda hasaba alnan!`)
        );
      }

      // Hash the password before storing it
      const hashPassword = await bcrypt.hash(password, 6);

      // Create user and basket
      const candidate = await UserForAdminPage.create({
        role,
        password: hashPassword,
        phoneNumber,
        name,
      });

      const jsonwebt = generateJwt(
        candidate.id,
        candidate.email,
        candidate.role
      );

      return res.status(201).json({ token: jsonwebt });
    } catch (error) {
      console.error(error);
      next(ApiError.badRequest("Something went wrong during registration"));
    }
  }
  // async login(req, res, next) {
  //   try {
  //     const { phoneNumber, password } = req.body;

  //     if (!phoneNumber || !password) {
  //       return next(ApiError.badRequest("Telefon belgi ýa-da açar söz giriz!"));
  //     }

  //     // Check if user exists
  //     const user = await User.findOne({ where: { phoneNumber } });
  //     if (!user) {
  //       return next(ApiError.badRequest("Ulanyjy ýok!"));
  //     }

  //     // Compare passwords
  //     const isPasswordCorrect = await bcrypt.compare(password, user.password);
  //     if (!isPasswordCorrect) {
  //       return next(ApiError.badRequest("Açar söz nädogry!"));
  //     }

  //     // Generate JWT
  //     const jsonwebt = generateJwt(user.id, user.email, user.role);

  //     return res.json({ token: jsonwebt, user: user });
  //   } catch (error) {
  //     console.error(error);
  //     next(ApiError.badRequest(error.message));
  //   }
  // }
  async login(req, res, next) {
    try {
      const { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return next(ApiError.badRequest("Telefon belgi ýa-da açar söz giriz!"));
      }

      const user = await User.findOne({ where: { phoneNumber } });
      if (!user) {
        return next(ApiError.badRequest("Ulanyjy ýok!"));
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return next(ApiError.badRequest("Açar söz nädogry!"));
      }

      const jsonwebt = generateJwt(user.id, user.email, user.role);

      // Remove the password before sending the response
      const { password: removed, ...userWithoutPassword } = user.dataValues;

      return res.json({ token: jsonwebt, user: userWithoutPassword });
    } catch (error) {
      console.error(error);
      next(ApiError.badRequest(error.message));
    }
  }
  async loginToAdminPage(req, res, next) {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        return next(ApiError.badRequest("Login ýa-da açar söz giriz!"));
      }

      const user = await UserForAdminPage.findOne({ where: { name } });
      if (!user) {
        return next(ApiError.badRequest("Ulanyjy ýok!"));
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return next(ApiError.badRequest("Açar söz nädogry!"));
      }

      const jsonwebt = generateJwt(user.id, user.email, user.role);

      // Remove the password before sending the response
      const { password: removed, ...userWithoutPassword } = user.dataValues;

      return res.json({ token: jsonwebt, user: userWithoutPassword });
    } catch (error) {
      console.error(error);
      next(ApiError.badRequest(error.message));
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
        attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      });

      return res.json({ message: "success", users });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
  async getAllAdminPageUsers(req, res, next) {
    try {
      const users = await UserForAdminPage.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "password"] },
      });

      return res.json({ message: "success", users });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ýalňyşlyk!"));
    }
  }
}
module.exports = new UserController();
