import products from "../../static/products";
import connectDb from "../../utils/connectDb";

//run database connection
connectDb();
export default (req, res) => {
  res.status(200).json(products);
};
