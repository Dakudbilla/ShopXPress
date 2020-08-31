import React, { useState, useEffect, useRef } from "react";
import cookie from "js-cookie";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import { Header, Icon, Table, Tab, Checkbox } from "semantic-ui-react";
import formatDate from "../../utils/formatDate";
const AccountPermissions = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const url = `${baseUrl}/api/users`;
    const token = cookie.get("token");
    const payload = { headers: { Authorization: token } };
    const res = await axios.get(url, payload);

    setUsers(res.data);
  };

  return (
    <div style={{ margin: "2em 0" }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>

      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <UserPermission key={user._id} user={user} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

const UserPermission = ({ user }) => {
  const [admin, setAdmin] = useState(user.role === "admin");

  const isFirstRun = useRef(true);
  const handleChangeRole = () => {
    setAdmin((prevState) => !prevState);
  };

  const updateRoleChange = async () => {
    const url = `${baseUrl}/api/account`;
    const payload = { _id: user._id, role: admin ? "admin" : "user" };

    await axios.put(url, payload);
  };
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    updateRoleChange();
  }, [admin]);
  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox toggle checked={admin} onChange={handleChangeRole} />
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
      <Table.Cell>{admin ? "admin" : "user"}</Table.Cell>
    </Table.Row>
  );
};

export default AccountPermissions;
