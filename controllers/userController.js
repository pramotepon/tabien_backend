const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid");

const config = require("../config/index");

exports.getUser = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    data: users,
  });
};

exports.seedUsers = async (req, res, next) => {
  try {
    let user = new User();
    const data = [{
        email: "user1@gmail.com",
        password: await user.encryptPassword('123456'),
        firstname: "fname1",
        lastname: "lname1",
        tel: "0111111111",
      },
      {
        email: "user2@gmail.com",
        password: await user.encryptPassword('123456'),
        firstname: "fname2",
        lastname: "lname2",
        tel: "022222222",
      }];
    const users = await User.insertMany(data);
    return res.status(201).json({
        data: users,
      });
  } catch (error) {
    return res.status(201).json({
        message: "คุณมีข้อมูล User อยู่แล้ว",
      });
  }
};

exports.insertUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่รับมา ไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const { email, firstname, lastname, tel, password } = req.body;
    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      const error = new Error("มีผู้ใช้งานอีเมลนี้แล้ว");
      error.status_code = 400;
      throw error;
    }

    let user = new User();
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.tel = tel;
    user.password = await user.encryptPassword(password);
    await user.save();

    return res.status(201).json({
      message: "ลงทะเบียนสำเร็จ",
    });
  } catch (error) {
    next(error);
  }
};
// select staff by id
exports.findUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// update User
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, firstname, lastname, tel, password, role } = req.body;
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 404;
      throw error;
    }
    user.email = email;
    user.firstname = firstname;
    user.lastname = lastname;
    user.tel = tel;
    // staff.password = await staff.encryptPassword(password);
    // staff.role = role;

    await user.save();

    if (user.nModified === 0) {
      const error = new Error("ไม่สามารถอัพเดตข้อมูลได้");
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({
        message: "แก้ไขข้อมูลสำเร็จ",
      });
    }
  } catch (error) {
    next(error);
  }
};

// delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.deleteOne({ _id: id });
    if (user.deleteCount === 0) {
      const error = new Error("ไม่สามารถลบข้อมูลได้");
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อย",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  // ครอบ Try catch
  try {
    // destruct email และ password
    const { email, password } = req.body;
    // ตรวจสอบ email ในระบบ
    const user = await User.findOne({ email: email });
    // ถ้าไม่เจอให้ catch next error
    if (!user) {
      const error = new Error("ไม่มีผู้ใช้งานนี้");
      error.statusCode = 404;
      throw error;
    }
    // ตรวจสอบ รหัสผ่าน เรียกใช้ฟังก์ชั่นที่เราสร้างใน model
    const isValid = await user.checkPassword(password);
    // ถ้าเป็น false ให้ catch next error
    if (!isValid) {
      const error = new Error("รหัสผ่านไม่ถูกต้อง");
      // 401 คือ un autho
      error.statusCode = 401;
      throw error;
    }

    // เข้าสู่ระบบ
    // สร้าง token
    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "5 days",
      }
    );

    // decode exp
    const expires_in = jwt.decode(token);
    // ส่งข้อมูลออกไป
    res.status(200).json({
      // token ข้อมูล
      access_token: token,
      // วันหมดอายุของ token
      expires_id: expires_in.exp,
      // ประเภทของ token
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};

// Profiel User
exports.me = async (req, res, next) => {
  // console.log(req);
  const { _id, firstname, lastname, email, tel, role } = req.user;
  return res.status(200).json({
    user: {
      id: _id,
      name: firstname + " " + lastname,
      email: email,
      tel: tel,
      role: role,
    },
  });
};
