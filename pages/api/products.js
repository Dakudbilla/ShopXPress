import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";
//run database connection
connectDb();
export default async (req, res) => {
  const { page, size } = req.query;
  //convert query string to numbers
  const pageNum = Number(page);
  const pageSize = Number(size);
  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / pageSize);
  let products = [];
  if (pageNum === 1) {
    products = await Product.find().limit(pageSize);
  } else {
    const skips = pageSize * (pageNum - 1);
    products = await Product.find().skip(skips).limit(pageSize);
  }
  res.status(200).json({ products, totalPages });
};
