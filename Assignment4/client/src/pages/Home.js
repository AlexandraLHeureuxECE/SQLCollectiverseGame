import React, { useState, useEffect } from 'react';
import '../cssFiles/HomePage.css';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '', 
    email: '',
  });

  const [publicLobbies, setPublicLobbies] = useState([]);
  const [joinedLobbies, setJoinedLobbies] = useState([]);
  const [lobbyCode, setLobbyCode] = useState(''); // State for input value

  useEffect(() => {
    const userArray = JSON.parse(localStorage.getItem('user'));
    const userId = userArray[0].UserID;

    // Fetch user, public lobbies, and joined lobbies data as before
    // Fetch user data
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch public lobbies
    fetch('/api/lobby/public')
      .then(response => response.json())
      .then(data => setPublicLobbies(data))
      .catch(error => console.error('Error fetching public lobbies:', error));

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

  const joinLobbyByCode = (code) => {
    const userArray = JSON.parse(localStorage.getItem('user'));
    const userId = userArray[0].UserID;
    console.log(code);
    localStorage.setItem('lobbyCode', code);
    console.log(code);
    fetch('/api/lobby/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ code, userId }),
    })

    .then(response => response.json())
    .then(() => {
      fetch(`/api/lobby/${code}`)
        .then(response => response.json())
        .then(newLobbyDetails => {
          setJoinedLobbies(prevLobbies => [...prevLobbies, newLobbyDetails]);
        })
        .catch(error => console.error('Error fetching new lobby details:', error));
    })
    .catch(error => console.error('Error joining lobby:', error));
  };

  const goToCollectiveVerse = () => {
    navigate('/collectiveverse'); // This should be the path to your CollectiveVerse component or page
  };

  const handleJoinLobby = (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    joinLobbyByCode(lobbyCode); // Call joinLobbyByCode with the user-inputted code
    setLobbyCode(''); // Clear the input field after submitting
  };
  const navigate = useNavigate();

  const handleManageAccountClick = () => {
    navigate('/dashboard'); // This should be the path to your Dashboard component
  };

  return (
    <div>
      <h1>Welcome, {userData.first_name}!</h1>

      <div>
      <button className="account-btn" onClick={handleManageAccountClick}>
          Manage Account
        </button>
      </div>
      
      
      {/* Form for joining a lobby by code */}
      <form onSubmit={handleJoinLobby} className="join-lobby-form">
        <input
          type="text"
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          placeholder="Enter Lobby Code"
        />
        <button type="submit" className="join-by-code-btn">Join by Code</button>
      </form>

      <div>
        <h2>Public Lobbies</h2>
        <table className="lobby-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {publicLobbies.map(lobby => (
              <tr key={lobby.LobbyID}>
                <td>{lobby.Lobby_Title}</td>
                <td>{lobby.Lobby_Code}</td>
                <td>
                  <button onClick={() => joinLobbyByCode(lobby.Lobby_Code)}>Join</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Joined Lobbies</h2>
        <table className="lobby-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>ID</th>
              <th>Type</th>
            </tr>
           </thead>
          <tbody>
            {joinedLobbies.map(lobby => (
              <tr key={lobby.LobbyID}>
                <td>{lobby.Lobby_Title}</td>
                <td>{lobby.LobbyID}</td>
                <td>{lobby.Lobby_Type}</td>
                <td>
                  <button onClick={goToCollectiveVerse}>Play Now!</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;