import { Input } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";
import Cookie from "js-cookie";
import axios from "axios";
const AddProductToCart = ({ user, productId }) => {
  //add number of products to state
  const [quantity, setQuantity] = useState(1);
  //Check if adding product to cart is succesful
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const Router = useRouter();
  useEffect(() => {
    let timeOut;
    if (success) {
      timeOut = setTimeout(() => setSuccess(false), 3000);
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [success]);

  ///Add product to cart
  const handleAddProductToCart = async () => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const token = Cookie.get("token");
      const payload = { quantity, productId };

      const headers = {
        headers: { Authorization: token },
      };

      await axios.put(url, payload, headers);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, window.alert);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Input
      type="number"
      min={1}
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      placeholder="Quantity"
      action={
        user && success
          ? {
              color: "blue",
              content: "Item Added",
              icon: "plus cart",
              disabled: true,
            }
          : user
          ? {
              color: "orange",
              content: "Add to Cart",
              icon: "plus cart",
              loading,
              disabled: loading,
              onClick: handleAddProductToCart,
            }
          : {
              color: "blue",
              content: "Sign  Up to Purchase",
              icon: "signup",
              onClick: () => Router.push("/signup"),
            }
      }
    />
  );
};

export default AddProductToCart;
