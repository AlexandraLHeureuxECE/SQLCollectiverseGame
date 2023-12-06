import React, { useState, useEffect } from 'react';
import '../cssFiles/Admin.css';

function Admin() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedAdmin, setExpandedAdmin] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    // Fetch the list of admins from the backend when the component mounts
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/admin');
        if (response.ok) {
          const adminsData = await response.json();
          setAdmins(adminsData);
        } else {
          console.error('Failed to fetch admins:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred during fetch:', error);
      }
    };

    fetchAdmins();

    // Fetch the list of users from the backend when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred during fetch:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleExpandedAdmin = (admin) => {
    // Toggle the expandedAdmin state for the clicked admin
    setExpandedAdmin((prevExpandedAdmin) =>
      prevExpandedAdmin === admin.AdminID ? null : admin.AdminID
    );
  };

  const toggleExpandedUser = (user) => {
    // Toggle the expandedUser state for the clicked user
    setExpandedUser((prevExpandedUser) =>
      prevExpandedUser === user.UserID ? null : user.UserID
    );
  };

  const renderAdminList = () => {
    return (
      <div>
        <h2>Admin List</h2>
        <ul>
          {admins.map((admin) => (
            <li key={admin.AdminID}>
              <span className="toggle-button" onClick={() => toggleExpandedAdmin(admin)}>
                {expandedAdmin === admin.AdminID ? '▼' : '►'}
              </span>
              {admin.Username}
              {expandedAdmin === admin.AdminID && (
                <div className="expanded-details">
                  <p>AdminID: {admin.AdminID}</p>
                  <p>Email: {admin.email}</p>
                  <p>Admin Permission: {admin.Admin_Permission}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderUserList = () => {
    return (
      <div>
        <h2>User List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.UserID}>
              <span className="toggle-button" onClick={() => toggleExpandedUser(user)}>
                {expandedUser === user.UserID ? '▼' : '►'}
              </span>
              {user.Username || user.email}
              {expandedUser === user.UserID && (
                <div className="expanded-details">
                  <p>User ID: {user.UserID}</p>
                  <p>First Name: {user.first_name}</p>
                  <p>Last Name: {user.last_name}</p>
                  <p>Email: {user.email}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {renderAdminList()}
      {renderUserList()}
    </div>
  );
}

export default Admin;
