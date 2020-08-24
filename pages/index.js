import axios from "axios";

const Home = ({ products }) => {
  return <>home</>;
};

//Get initialprops helps us to fetch data on server before page loads
//Data fetch becomes props available to the component
Home.getInitialProps = async () => {
  //fetch data on server
  const url = "http://localhost:3000/api/products";
  const res = await axios.get(url);
  return { products: res.data };
};

export default Home;
