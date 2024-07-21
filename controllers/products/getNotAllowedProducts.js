const { Product } = require("../../models");

const getNotAllowedProducts = async bloodType => {
    const blood = [null, false, false, false, false];
    blood[bloodType] = true;
    const products = Product.find({
        groupBloodNotAllowed: { $all: [blood] },
    });
    return products;
};

module.exports = getNotAllowedProducts;