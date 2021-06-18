const Province = require("../models/provinceModel");

exports.getProvince = async (req, res) => {
  const provinces = await Province.find();
  return res.status(200).json({
    data: provinces,
  });
};