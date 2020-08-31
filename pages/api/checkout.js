import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Product from "../../models/Product";
import calculateCartTotal from "../../utils/calculateCartTotal";
import Order from "../../models/Order";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { paymentData } = req.body;
  try {
    //Verify and get User Id
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    //Find cart based on user Id, populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });

    //calculate cart totals again from cart products
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);

    //get email for payment data, see if email linked with existing stripe customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1,
    });
    const isExistingCustomer = prevCustomer.data.length > 0;

    //If not existing customer create them using their email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id,
      });
    }

    const customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;

    //create charge with total send receipt email
    const charge = await stripe.charges.create(
      {
        currency: "usd",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`,
      },
      {
        //Prevent generation of multiple charges for same product
        idempotency_key: uuidv4(),
      }
    );

    //add order data to database and save
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products,
    }).save();

    //clear products in cart
    await Cart.findByIdAndUpdate({ _id: cart._id }, { $set: { products: [] } });
    //send back success(200) response
    res.status(200).send("Checkout");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Processing payment");
  }
};
