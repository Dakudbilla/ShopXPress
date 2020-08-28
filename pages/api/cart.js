import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";
connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "GET":
      await handleGetRequest(req, res);
      break;

    default:
      res.status(405).send("Method Not Allowed");
      break;
  }
};

const handleGetRequest = async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: Product,
    });

    res.status(200).json(cart.products);
  } catch (err) {
    res.status(403).send("Please login again");
    console.error(err.message, "Failed");
  }
};
//Handle adding of products to cart
const handlePutRequest = async (req, res) => {
  //Pick out quantity and product Id of product bought from body
  const { quantity, productId } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    //Get user's id from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    //Find cart of user
    const cart = await Cart.findOne({ user: userId });

    //Check if there exists already the product to be added
    const productExists = cart.products.some((doc) =>
      mongoose.Types.ObjectId(productId).equals(doc.product)
    );
    if (productExists) {
      //Find and update cart with product bought its id and quantity
      const UpdateCart = await Cart.findOneAndUpdate(
        { _id: cart._id, "products.product": productId },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      );
      console.log(UpdateCart, "Updated cart");
    } else {
      //If product was not in cart already
      //Create new product
      const newProduct = { quantity, product: productId };
      //Add product to cart
      const addedProductCart = await Cart.findOneAndUpdate(
        {
          _id: cart._id,
        },
        { $addToSet: { products: newProduct } },
        { new: true }
      );
      console.log(addedProductCart, "newProduct");
    }

    res.status(200).send("Cart Updated");
  } catch (err) {
    res.status(403).send("Please login again");
    console.error(err.message, "Failed");
  }
};
