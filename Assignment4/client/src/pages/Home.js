import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        // Simulating user authentication with a placeholder user ID (replace with actual authentication)
        const userId = 1;

        // Fetch user data
        axios.get(`/api/user/${userId}`)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // Fetch public lobbies
        axios.get('/api/lobby/public')
            .then(response => {
                setPublicLobbies(response.data);
            })
            .catch(error => {
                console.error('Error fetching public lobbies:', error);
            });

        // Fetch lobbies joined by the user
        axios.get(`/api/lobby/user/${userId}`)
            .then(response => {
                setJoinedLobbies(response.data);
            })
            .catch(error => {
                console.error('Error fetching joined lobbies:', error);
            });
    }, []);

    // Function to join a lobby by code
    const joinLobbyByCode = (code) => {
        // Simulating user authentication with a placeholder user ID (replace with actual authentication)
        const userId = 1;

        // Make API call to join the lobby
        axios.post('/api/lobby/join', { code, userId })
            .then(response => {
                console.log('Successfully joined lobby:', response.data);

                // Update joinedLobbies state
                setJoinedLobbies([...joinedLobbies, response.data]);
            })
            .catch(error => {
                console.error('Error joining lobby:', error);
            });
    };

    return (
        <div>
            <h1>Welcome, {userData.first_name}!</h1>

            {/* Account Settings */}
            <div>
                <h2>My Account</h2>
                {/* Display user information and allow updates */}
                {/* ... */}
            </div>

            {/* Browse Public Lobbies */}
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

            {/* Joined Lobbies */}
            <div>
                <h2>Joined Lobbies</h2>
                <ul>
                    {joinedLobbies.map(lobby => (
                        <li key={lobby.LobbyID}>
                            {lobby.Lobby_Title} - {lobby.Lobby_Code}
                            {/* Display additional lobby information */}
                            {/* ... */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;