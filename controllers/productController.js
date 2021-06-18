const Product = require("../models/productModel");
const { validationResult } = require('express-validator');

exports.getProduct = async (req, res) => {
  const products = await Product.find().populate('user', '-id -password');
  res.status(200).json({
    data: products,
  });
};

exports.insertProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const { licence_code, licence_province, licence_price, user } = req.body;
    let product = new Product;
    product.licence_code = licence_code;
    product.licence_province = licence_province;
    product.licence_price = licence_price;
    product.user = user;
    await product.save();

    const last_product = await Product.find({ user: user }).sort({'createdAt': -1}).limit(1).populate('user', '-id -password');

    return res.status(201).json({
      data: last_product
    });

  } catch (error) {
    next(error);
  }
}

// select staff by id
exports.findProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('user', '-id -password');
    if (!product) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.deleteOne({ _id: id });
    if (product.deletedCount === 0) {
      const error = new Error('ไม่สามารถลบข้อมูลได้');
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({
        data: "ลบข้อมูลเรียบร้อย"
      });
    }

  } catch (error) {
    next(error);
  }
}

exports.buyProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customer_id } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error("ไม่พบข้อมูล");
      error.statusCode = 404;
      throw error;
    }

    product.user_buy = customer_id;
    product.licence_status = "sold out";

    await product.save();

    if (product.nModified === 0) {
      const error = new Error("ไม่สามารถซื้อได้ กรุณาติดต่อผู้ขาย");
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({
        data: "ซื้อสินค้าสำเร็จ",
      });
    }
  } catch (error) {
    next(error);
  }
}

exports.historyProductSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.find({ user: id }).populate('user', '-id -password');
    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

exports.historyProductBuy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.find({ user_buy: id }).populate('user', '-id -password');
    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
}