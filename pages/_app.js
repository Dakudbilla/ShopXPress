import App from "next/app";
import Layout from "../components/_App/Layout";
import { parseCookies, destroyCookie } from "nookies";
import { redirectUser } from "../utils/auth";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { Router } from "next/router";
class MyApp extends App {
  //ctx provides information on the route user is on and req and res
  //Get initialprops helps us to fetch data on server before page is rendered

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    //Extract cookie
    const { token } = parseCookies(ctx);

    if (!token) {
      //Redirect unauthenticated user to login when user tries to access protected routes
      const isProtectedRoute =
        ctx.pathname === "/account" || ctx.pathname === "/create";
      if (isProtectedRoute) {
        redirectUser(ctx, "/login");
      }
    } else {
      try {
        const config = { headers: { Authorization: token } };

        const url = `${baseUrl}/api/account`;
        const res = await axios.get(url, config);
        const user = res.data;
        //check if user is 'root' user
        const isRoot = user.role === "root";
        //check if user is 'admin' user

        const isAdmin = user.role === "admin";
        //if authenticated but not 'admin' or 'root' redirect from '/create' page
        const isNotPermitted =
          !(isAdmin || isRoot) && ctx.pathname === "/create";

        if (isNotPermitted) {
          redirectUser(ctx, "/");
        }
        //Add user to props
        pageProps.user = user;
      } catch (err) {
        console.error("Error getting Logged In user", err.message);

        //Throw away invalid token from cookie
        destroyCookie(ctx, "token");

        //redirect to login page
        redirectUser(ctx, "/login");
      }
    }

    return { pageProps };
  }
  componentDidMount() {
    window.addEventListener("storage", this.synLougout);
  }
  syncLougout = (e) => {
    if (e.key === "logout") {
      Router.push("/login");
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
