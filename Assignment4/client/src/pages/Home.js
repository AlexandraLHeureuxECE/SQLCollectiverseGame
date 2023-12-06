import React, { useState, useEffect } from 'react';

function Home() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });

  const [publicLobbies, setPublicLobbies] = useState([]);
  const [joinedLobbies, setJoinedLobbies] = useState([]);

  useEffect(() => {
    // Get the user ID from local storage
    const userArray = JSON.parse(localStorage.getItem('user'));
    const userId = userArray[0].UserID;
    console.log(userId);

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
      // Fetch details for each joined lobby
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
    // Get the user ID from local storage
    const userArray = JSON.parse(localStorage.getItem('user'));
    const userId = userArray[0].UserID;

    // Make fetch call to join the lobby
    fetch('/api/lobby/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, userId }),
    })
    .then(response => response.json())
    .then(data => {
      setJoinedLobbies([...joinedLobbies, data]);
      window.location.reload(); // Refresh the page
    })
    .catch(error => console.error('Error joining lobby:', error));
  };

  return (
    <div>
      <h1>Welcome, {userData.first_name}!</h1>

      <div>
        <h2>My Account</h2>
        {/* Display user information and allow updates */}
      </div>

      <div>
        <h2>Public Lobbies</h2>
        <ul>
            {publicLobbies.map(lobby => (
            <li key={lobby.LobbyID}>
                {lobby.Lobby_Title} - {lobby.Lobby_Code}
                <button onClick={() => joinLobbyByCode(lobby.Lobby_Code)}>Join</button>
            </li>
            ))}
        </ul>
        </div>

      <div>
        <h2>Joined Lobbies</h2>
        <ul>
          {joinedLobbies.map(lobby => (
            <li key={lobby.LobbyID}>
              {lobby.Lobby_Title} - {lobby.LobbyID} - {lobby.Lobby_Type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
