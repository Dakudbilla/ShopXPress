import {
  Segment,
  Header,
  Icon,
  Button,
  Item,
  Message,
} from "semantic-ui-react";
import { useRouter } from "next/router";

const CartItemList = ({ products, success, user, handleRemoveFromCart }) => {
  const Router = useRouter();

  const mapCartProductionsToItems = (products) => {
    return products.map((p) => ({
      childKey: p._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => Router.push(`/product?_id=${p.product._id}`)}
        >
          {p.product.name}
        </Item.Header>
      ),

      image: p.product.mediaUrl,
      meta: `${p.quantity} x ${p.product.price}`,
      fluid: "true",
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          color="red"
          onClick={() => handleRemoveFromCart(p.product._id)}
        />
      ),
    }));
  };
  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    );
  }
  if (products.length === 0) {
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No Products in your cart. Add Some
        </Header>
        <div>
          {user ? (
            <Button color="orange" onClick={() => Router.push("/")}>
              view Products
            </Button>
          ) : (
            <Button color="blue" onClick={() => Router.push("/login")}>
              Login to Add Products
            </Button>
          )}
        </div>
      </Segment>
    );
  }
  return <Item.Group items={mapCartProductionsToItems(products)} />;
};

export default CartItemList;
