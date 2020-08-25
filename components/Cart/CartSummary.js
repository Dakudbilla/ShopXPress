const { Divider, Segment, Button } = require("semantic-ui-react");

const CartSummary = () => {
  return (
    <>
      <Divider />
      <Segment clearing size="large" textAlign="left">
        <strong>Sub total:</strong>$0.00
        <Button icon="cart" color="teal" content="Checkout" floated="right" />
      </Segment>
    </>
  );
};

export default CartSummary;
