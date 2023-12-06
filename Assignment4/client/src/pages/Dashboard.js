import React, { useState, useEffect } from 'react';
import '../cssFiles/Dashboard.css'; // Ensure this CSS file is correctly linked
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });

  const [joinedLobbies, setJoinedLobbies] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const userArray = JSON.parse(localStorage.getItem('user'));
    const userId = userArray[0].UserID;

    // Fetch user data
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch lobbies joined by the user
    fetch(`/api/lobby/user/${userId}`)
      .then(response => response.json())
      .then(joinedLobbies => {
        const lobbyDetailsPromises = joinedLobbies.map(lobby =>
          fetch(`/api/lobby/${lobby.LobbyID}`)
            .then(response => response.json())
        );
        return Promise.all(lobbyDetailsPromises);
      })
      .then(lobbyDetails => setJoinedLobbies(lobbyDetails))
      .catch(error => console.error('Error fetching joined lobbies:', error));
  }, []);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordUpdateMessage('New passwords do not match.');
      return;
    }

    // Update password API call
    fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }),
    })
    .then(response => response.json())
    .then(data => setPasswordUpdateMessage(data.message))
    .catch(error => console.error('Error updating password:', error));
  };

  const leaveLobby = (lobbyId) => {
    const confirmLeave = window.confirm("Are you sure you want to leave this lobby?");
    
    if (confirmLeave) {
      const userId = JSON.parse(localStorage.getItem('user'))[0].UserID;
  
      fetch('/api/lobby/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, lobbyId }),
      })
      .then(response => response.json())
      .then(() => {
        // Update the joinedLobbies state to remove the left lobby
        setJoinedLobbies(joinedLobbies.filter(lobby => lobby.LobbyID !== lobbyId));
      })
      .catch(error => console.error('Error leaving lobby:', error));
    }
  };
  
  return (
    <div className ="h2dashboard">
    <div className="dashboard">
            
      <h1 className="h2dashboard">Dashboard</h1>
      <div className="user-info">

        <h2 className="h2dashboard">User Info</h2>
        <p>Name: {userData.first_name} {userData.last_name}</p>
        <p>Username: {userData.username}</p>
        <p>Email: {userData.email}</p>
      </div>

      <div className="password-update">
        <h2>Update Password</h2>
        <form onSubmit={handlePasswordUpdate}>
          <input 
            type="password" 
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
            required 
          />
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required 
          />
          <input 
            type="password" 
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm New Password"
            required 
          />
          <button type="submit">Update Password</button>
        </form>
        {passwordUpdateMessage && <p>{passwordUpdateMessage}</p>}
      </div>

      <div className="joined-lobbies">
        <h2>Joined Lobbies</h2>
        <ul>
          {joinedLobbies.map(lobby => (
            <li key={lobby.LobbyID}>
              {lobby.Lobby_Title} - ID: {lobby.LobbyID} - Type: {lobby.Lobby_Type}
              <button 
                onClick={() => leaveLobby(lobby.LobbyID)} 
                className="leave-lobby-btn"
              >
                Leave Lobby
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;