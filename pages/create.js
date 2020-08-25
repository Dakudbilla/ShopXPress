import axios from "axios";
import {
  Header,
  Icon,
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
} from "semantic-ui-react";
import { useState, useEffect } from "react";

import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";
const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: "",
};
const CreateProduct = () => {
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  //Toggle to enable or disable form submit button when any of the fields is not filled
  const [disabled, setDisabled] = useState(true);
  //toggle to show or hide loading spinner during api resquests
  const [loading, setLoading] = useState(false);
  //use success to show or hide success message
  const [success, setSuccess] = useState(false);
  //Destructure product content
  const { name, price, media, description } = product;
  //Allow media preview when image is uploaded
  const [mediaPreview, setMediaPreview] = useState("");
  //allow errors to display to error
  const [error, setError] = useState("");
  useEffect(() => {
    const isProduct = Object.values(product).every((el) => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setProduct((prevState) => ({ ...prevState, media: files[0] }));
      //Preview media file
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", product.media);
    data.append("upload_preset", "reactReserve");
    data.append("cloud_name", "akuddev");

    try {
      const res = await axios.post(process.env.CLOUDINARY_URL, data);
      const mediaUrl = res.data.url;
      return mediaUrl;
    } catch (err) {
      catchErrors(err, setError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const mediaUrl = await handleImageUpload();

      const url = `${baseUrl}/api/product`;
      const payload = { name, price, mediaUrl, description };
      const newProduct = await axios.post(url, payload);

      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        onSubmit={handleSubmit}
        success={success}
        error={Boolean(error)}
      >
        <Message
          error
          header="Oops!"
          content={error.includes("<") ? "Something went wrong" : error}
          onDismiss={() => setError(false)}
        />

        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
          onDismiss={() => setSuccess(false)}
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            value={name}
            placeholder="Name"
            onInput={handleChange}
          />

          <Form.Field
            control={Input}
            name="price"
            label="Price"
            value={price}
            placeholder="Price"
            type="number"
            min={0.0}
            step={0.01}
            onInput={handleChange}
          />

          <Form.Field
            control={Input}
            name="media"
            label="Media"
            type="file"
            placeholder="Name"
            accept="image/*"
            content="Select Image"
            onInput={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />

        <Form.Field
          control={TextArea}
          value={description}
          name="description"
          label="Description"
          placeholder="Write here"
          onInput={handleChange}
        />
        <Form.Field
          control={Button}
          icon="pencil alternate"
          label="Submit"
          placeholder="Name"
          content="Submit"
          type="submit"
          color={!disabled ? "blue" : "grey"}
          disabled={loading || disabled}
        />
      </Form>
    </>
  );
};

export default CreateProduct;
