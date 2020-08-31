const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://shopx-press.now.sh"
    : "http://localhost:3000";

export default baseUrl;
