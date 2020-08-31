import Product from "../../models/Product";

import connectDb from "../../utils/connectDb";
import Cart from "../../models/Cart";
connectDb();
export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

const handlePostRequest = async (req, res) => {
  const { name, price, description, mediaUrl } = req.body;
  if (!name || !price || !description || !mediaUrl) {
    return res.status(400).send("Product missing one or more fields");
  }
  try {
    const product = new Product({
      name,
      price,
      description,
      mediaUrl,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message, "Failed ");
    res.status(500).json({ msg: "Error creating product" });
  }
};

const handleDeleteRequest = async (req, res) => {
  const { _id } = req.query;
  try {
    //Delete by id
    await Product.findOneAndDelete({ _id });
    //Remove product from all carts referenced as 'product
    //This is called cascade deleting(deleting from many documents)

    await Cart.updateMany(
      { "products.product": _id },
      { $pull: { products: { product: _id } } }
    );
    res.status(204).json({});
  } catch (err) {
    console.error(err.message, "Failed");
    res.status(500).json({ msg: "failed" });
  }
};

const handleGetRequest = async (req, res) => {
  const { _id } = req.query;

  try {
    const product = await Product.findOne({ _id });
    res.status(200).json(product);
  } catch (err) {
    console.error(err.message, "Failed");
    res.status(500).json({ msg: "failed" });
  }
};
