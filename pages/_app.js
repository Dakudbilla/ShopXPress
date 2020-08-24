import App from "next/app";
import Layout from "../components/_App/Layout";

class MyApp extends App {
  //ctx provides information on the route user is on
  //Get initialprops helps us to fetch data on server before page is rendered

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
