import { Segment } from "semantic-ui-react";
import { useState } from "react";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import axios from "axios";

import CardItemList from "../components/Cart/CartItemList";
import CardSummary from "../components/Cart/CartSummary";

import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const Cart = ({ products, user }) => {
  const [cartProducts, setCartProducts] = useState(products);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  //Handle checkout
  const handleCheckout = async (paymentData) => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get("token");
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      const res = await axios.post(url, payload, headers);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, window.alert);
    } finally {
      setLoading(false);
    }
  };

  //handle delete delete request
  const handleRemoveFromCart = async (productId) => {
    const url = `${baseUrl}/api/cart`;

    const token = cookie.get("token");
    const payload = {
      params: { productId },
      headers: { Authorization: token },
    };

    const res = await axios.delete(url, payload);
    setCartProducts(res.data);
  };

  return (
    <Segment loading={loading}>
      <CardItemList
        handleRemoveFromCart={handleRemoveFromCart}
        user={user}
        products={cartProducts}
        success={success}
      />
      <CardSummary
        success={success}
        handleCheckout={handleCheckout}
        products={cartProducts}
      />
    </Segment>
  );
};
Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) {
    return { products: [] };
  }

  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };

  const res = await axios.get(url, payload);
  return { products: res.data };
};
export default Cart;
