import axios from "axios";
import ProductList from "../components/Index/ProductList";
import baseUrl from "../utils/baseUrl";
import ProductPagination from "../components/Index/ProductPagination";
const Home = ({ products, totalPages }) => {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
};

//Get initialprops helps us to fetch data on server before page loads
//Data fetch becomes props available to the component
Home.getInitialProps = async (ctx) => {
  const page = ctx.query.page ? ctx.query.page : "1";
  const size = 9;
  const payload = { params: { page, size } };
  //fetch data on server
  const url = `${baseUrl}/api/products`;
  const res = await axios.get(url, payload);
  return res.data;
};

export default Home;
