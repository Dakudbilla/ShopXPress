import CardItemList from "../components/Cart/CartItemList";
import CardSummary from "../components/Cart/CartSummary";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

const Cart = () => {
  const user = false;
  return (
    <Segment secondary color="teal" inverted textAlign="center" placeholder>
      <Header icon>
        <Icon name="shopping basket" />
        No Products in your cart. Add Some
      </Header>
      <div>
        {user ? (
          <Button color="orange">view Products</Button>
        ) : (
          <Button color="blue">Login to Add Products</Button>
        )}
      </div>
      <CardSummary />
    </Segment>
  );
};

export default Cart;
