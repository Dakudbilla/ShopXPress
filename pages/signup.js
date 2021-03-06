import { Segment, Message, Form, Button, Icon } from "semantic-ui-react";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import { handleLogin } from "../utils/auth";
const INITIAL_USER = {
  name: "",
  email: "",
  password: "",
};
const Signup = () => {
  //allow errors to display to error
  const [error, setError] = useState("");
  //Toggle to enable or disable form submit button when any of the fields is not filled
  const [disabled, setDisabled] = useState(true);
  //toggle to show or hide loading spinner during api resquests
  const [loading, setLoading] = useState(false);
  //use success to show or hide success message
  const [success, setSuccess] = useState(false);

  //Setup state for user data
  const [user, setUser] = useState(INITIAL_USER);
  useEffect(() => {
    const isUser = Object.values(user).every((el) => Boolean(el));
    !isUser ? setDisabled(true) : setDisabled(false);
  }, [user]);
  const { name, email, password } = user;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const url = `${baseUrl}/api/signup`;
      const payload = { ...user };

      const res = await axios.post(url, payload);
      //Pass to login user
      handleLogin(res.data);
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Message
        attached
        icon="settings"
        header="Get Started"
        content="Create a new account"
        color="teal"
      />
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message
          error
          header="Oops!"
          content={error}
          onDismiss={() => setError(false)}
        />
        <Segment>
          <Form.Input
            label="Name"
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
            placeholder="name"
            name="name"
            type="text"
            value={name}
          />
          <Form.Input
            label="Email"
            type="email"
            fluid
            icon="mail"
            iconPosition="left"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            type="password"
            label="Password"
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          <Button
            disabled={disabled || loading}
            icon="signup"
            type="submit"
            color="orange"
            content="Sign Up"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <>
          Existing User <Icon name="help" />
          <Link href="/login">
            <a>Login in here</a>
          </Link>{" "}
          instead
        </>
      </Message>
    </>
  );
};

export default Signup;
