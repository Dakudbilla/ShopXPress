import axios from "axios";
import ProductList from "../components/Index/ProductList";
import baseUrl from "../utils/baseUrl";
const Home = ({ products }) => {
  return <ProductList products={products} />;
};

//Get initialprops helps us to fetch data on server before page loads
//Data fetch becomes props available to the component
Home.getInitialProps = async () => {
  //fetch data on server
  const url = `${baseUrl}/api/products`;
  const res = await axios.get(url);
  return { products: res.data };
};

export default Home;
