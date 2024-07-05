import SpecificDay from "../../models/specificDay.js";

const getAll = async (req, res) => {
  const { _id } = req.user;
  const { date } = req.query;
  const products = await SpecificDay.find({ owner: _id, date });
  res.json({
    status: "success",
    code: 200,
    data: { products },
  });
};

export { getAll };
