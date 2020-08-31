import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import calculateCartTotal from "../../utils/calculateCartTotal";

const { Divider, Segment, Button } = require("semantic-ui-react");

const CartSummary = ({ products, handleCheckout, success }) => {
  //Boolean for checking state of cart
  const [isCartEmpty, setCartEmpty] = useState(false);
  const [stripeAmount, setStripeAmount] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);

  //If cart is empty we update state
  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large" textAlign="left">
        <strong>Sub total:</strong> ${cartAmount}
        <StripeCheckout
          name="React Reserve"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          token={handleCheckout}
          triggerEvent={"onClick"}
          stripeKey="pk_test_51HMBc8Jm1uEKjr292yZ7Bsh8ni4qPE6YsWGeHOhSNydLGtXG25jPIia9GgTZknwSsSTvSic8qC1xxYGoJOL9A6pL000oV7Ij6R"
        >
          <Button
            icon="cart"
            color="teal"
            content="Checkout"
            floated="right"
            disabled={isCartEmpty || success}
          />
        </StripeCheckout>
      </Segment>
    </>
  );
};

export default CartSummary;
