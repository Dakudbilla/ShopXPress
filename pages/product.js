import axios from "axios";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";
import baseUrl from "../utils/baseUrl";

const Product = ({ product }) => {
  return (
    <>
      <ProductSummary {...product} />
      <ProductAttributes {...product} />
    </>
  );
};

Product.getInitialProps = async ({ query: { _id } }) => {
  const url = `${baseUrl}/api/product?_id=${_id}`;

  try {
    const res = await axios.get(url);
    return { product: res.data };
  } catch (err) {
    console.error(err.msg, "Fetch failed");
  }
};

export default Product;
