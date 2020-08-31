import { Menu, Container, Image, Icon } from "semantic-ui-react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import nProgress from "nprogress";
import { handleLogout } from "../../utils/auth";

const Header = ({ user }) => {
  const router = useRouter();
  //check if user is 'root' user
  const isRoot = user && user.role === "root";
  //check if user is 'admin' user

  const isAdmin = user && user.role === "admin";

  const isRoorOrAdmin = isAdmin || isRoot;
  const isActive = (route) => {
    return route === router.pathname;
  };
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

  return (
    <Menu fluid={true} stackable={true} id="menu" inverted>
      <Container text>
        <Link href="/">
          <Menu.Item header active={isActive("/")}>
            <Image
              size="mini"
              src="/static/logo.svg"
              style={{ marginRight: "1em" }}
            />
            ReactReserve
          </Menu.Item>
        </Link>
        <Link href="/cart">
          <Menu.Item header active={isActive("/cart")}>
            <Icon name="cart" size="large" />
            Cart
          </Menu.Item>
        </Link>
        {isRoorOrAdmin && (
          <Link href="/create">
            <Menu.Item header active={isActive("/create")}>
              <Icon name="add square" size="large" />
              Create
            </Menu.Item>
          </Link>
        )}
        {user ? (
          <>
            <Link href="/account">
              <Menu.Item header active={isActive("/account")}>
                <Icon name="user" size="large" />
                Account
              </Menu.Item>
            </Link>
            <Menu.Item header onClick={handleLogout}>
              <Icon name="sign out" size="large" />
              Logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Link href="/login">
              <Menu.Item header active={isActive("/login")}>
                <Icon name="sign in" size="large" />
                LogIn
              </Menu.Item>
            </Link>
            <Link href="/signup">
              <Menu.Item header active={isActive("/signup")}>
                <Icon name="signup" size="large" />
                SignUP
              </Menu.Item>
            </Link>
          </>
        )}
      </Container>
    </Menu>
  );
};

export default Header;
