import SpecificDay from "../../models/specificDay.js";
import { httpError } from "../../helpers/httpError.js";

const deleteProductById = async (req, res) => {
  const { productId } = req.params;
  const removedProduct = await SpecificDay.findByIdAndRemove(productId);
  if (!removedProduct) {
    throw new httpError(404, `Product with id=${productId} not found`);
  }
  res.json({
    code: 200,
    message: "product deleted",
    data: { removedProduct },
  });
};

export default deleteProductById;
