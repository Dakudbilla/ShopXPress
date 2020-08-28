import axios from "axios";
import { Header, Button, Modal } from "semantic-ui-react";
import { useState } from "react";
import baseUrl from "../../utils/baseUrl";
import { useRouter } from "next/router";

const ProductAttributes = ({ description, _id, user }) => {
  const router = useRouter();
  //Specifies whether modal be opened or not
  const [openModal, setOpenModalValue] = useState(false);
  //check if user is 'root' user
  const isRoot = user && user.role === "root";
  //check if user is 'admin' user

  const isAdmin = user && user.role === "admin";
  const handleDelete = async () => {
    //Delete product using id
    const url = `${baseUrl}/api/product?_id=${_id}`;
    await axios.delete(url);
    router.push("/");
  };
  return (
    <>
      <Header as="h3">About this Product</Header>
      <p>{description}</p>
      {(isAdmin || isRoot) && (
        <>
          <Button
            icon="trash alternate outline"
            color="red"
            content="Delete Product"
            onClick={() => setOpenModalValue(true)}
          />
          <Modal
            onClose={() => setOpenModalValue(false)}
            onOpen={() => setOpenModalValue(true)}
            open={openModal}
            dimmer="blurring"
          >
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              <p>Are You Sure You Want TO Delete this Product</p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                content="Cancel"
                onClick={() => setOpenModalValue(false)}
              />
              <Button
                negative
                icon="trash"
                labelPosition="right"
                content="delete"
                onClick={() => handleDelete()}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProductAttributes;
