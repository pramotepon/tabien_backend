const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = Schema(
    {
        name: {
            th: String,
            en: String
        }
    },
    {
        collection: "province",
    }
);

const product = mongoose.model('Province', schema);
module.exports = product;