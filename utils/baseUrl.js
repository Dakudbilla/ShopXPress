const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://shopxpress.now.sh"
    : "http://localhost:3000";

export default baseUrl;
