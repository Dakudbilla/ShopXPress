import { Card } from "semantic-ui-react";

const ProductList = ({ products }) => {
  const mapProductsToItems = (products) =>
    products.map((product) => ({
      header: product.name,
      image: product.mediaUrl,
      color: "teal",
      fluid: true,
      childKey: product._id,
      href: `/product?_id=${product._id}`,
      meta: `$${product.price}`,
    }));
  return (
    <Card.Group
      stackable
      itemsPerRow="3"
      centered={true}
      items={mapProductsToItems(products)}
    />
  );
};

export default ProductList;
