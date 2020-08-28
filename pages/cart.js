import CardItemList from "../components/Cart/CartItemList";
import CardSummary from "../components/Cart/CartSummary";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { Segment } from "semantic-ui-react";
const Cart = ({ products }) => {
  console.log(products);
  return (
    <Segment>
      <CardItemList />
      <CardSummary />
    </Segment>
  );
};
Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) {
    console.log("No token");
    return { products: [] };
  }

  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };

  const res = await axios.get(url, payload);
  return { products: res.data };
};
export default Cart;
