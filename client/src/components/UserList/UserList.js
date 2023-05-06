import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.css';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const tableRef = useRef(null);

  const fetchUsers = async () => {
    const result = await axios.get("http://localhost:9000/users");
    setUsers(result.data.users);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tableRef.current && users.length > 0) {
      $(tableRef.current).DataTable({ destroy: true });
    }
  }, [users]);

  useEffect(() => {
    if (tableRef.current && users.length > 0) {
      const dataTable = $(tableRef.current).DataTable({ destroy: true });
      dataTable.clear();
      dataTable.rows.add(
        users.map(({ name, age, sex, mobile, address, govtId, guardian, nationality }) => [
          name,
          age,
          sex,
          mobile || "",
          address || "",
          govtId || "",
          guardian || "",
          nationality || ""
        ])
      );
      dataTable.draw();
    }
  }, [users]);

  return (
    <div>
      <table ref={tableRef} id="myTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Govt ID</th>
            <th>Guardian Details</th>
            <th>Nationality</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.sex}</td>
              <td>{user.mobile}</td>
              <td>{user.address}</td>
              <td>{user.govtId}</td>
              <td>{user.guardian}</td>
              <td>{user.nationality}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
