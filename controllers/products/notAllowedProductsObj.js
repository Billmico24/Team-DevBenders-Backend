const getNotAllowedProducts = require("./getNotAllowedProducts");

const notAllowedProductsObj = async bloodType => {
    const notAllowedProductsArray = await getNotAllowedProducts(bloodType);
    const arr = [];
    notAllowedProductsArray.map(({ title }) => arr.push(title));
    let notAllowedProductsAll = [...new Set(arr)];
    let notAllowedProducts = [];
    const message = ['You can eat everything'];
    if (notAllowedProductsAll[0] === undefined) {
        notAllowedProducts = message;
    } else {
        do {
            const index = Math.floor(Math.random() * notAllowedProductsAll.length);
            if (notAllowedProducts.includes(notAllowedProductsAll[index]) || notAllowedProducts.includes('undefined')) {
                break;
            } else {
                notAllowedProducts.push(notAllowedProductsAll[index]);
            }
        } while (notAllowedProducts.length !== 5);
    };
    if (notAllowedProductsAll.length === 0) {
        console.log("length");
        notAllowedProductsAll = message;
    };
    const result = { notAllowedProductsAll, notAllowedProducts };
    return result;
};

module.exports = notAllowedProductsObj;
