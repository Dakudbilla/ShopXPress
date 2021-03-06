import { parseCookies } from "nookies";
import axios from "axios";
import AccountHeader from "../components/Account/AccountHeader";
import baseUrl from "../utils/baseUrl";
import AccountOrders from "../components/Account/AccountOrders";
import AccountPermissions from "../components/Account/AccountPermissions";

const Account = ({ user, orders }) => {
  return (
    <>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
      {user.role === "root" && <AccountPermissions />}
    </>
  );
};
Account.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { orders: [] };
  }
  const payload = { headers: { Authorization: token } };

  const url = `${baseUrl}/api/orders`;

  const res = await axios.get(url, payload);

  return res.data;
};

export default Account;
