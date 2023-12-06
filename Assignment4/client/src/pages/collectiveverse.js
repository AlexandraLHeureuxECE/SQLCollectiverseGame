// collectiveverse.js
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../cssFiles/collectiverse.css';
const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [userCharacters, setUserCharacters] = useState([]);

    const lobbyId = 1000; // Replace with your lobby ID
    const shuffleAmount=10;
    const [selectedCharacterId, setSelectedCharacterId] = useState(null);
    
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
      });
    // Get the user ID from local storage


    
    useEffect(() => {
      
        console.log(lobbyId);
        
        axios.get('/api/character')
            .then(response => {
                setCharacters(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);
    const userArray = JSON.parse(localStorage.getItem('user'));
    const userId = userArray[0].UserID;
    console.log(userId);
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching user data:', error));

    
    const deleteCharacter = () => {
        if (selectedCharacterId) {
            axios.delete(`/api/character/${selectedCharacterId}`)
                .then(response => {
                    alert('Character deleted successfully');
                    // Remove the deleted character from the userCharacters state
                    setUserCharacters(userCharacters.filter(character => character.CharacterID !== selectedCharacterId));
                })
                .catch(error => {
                    console.error('Error deleting character: ', error);
                    alert('Failed to delete character');
                });
        }
    };
    const getUserCharacters = () => {
        axios.get(`/api/character/user/${userId}/lobby/${lobbyId}`)
            .then(response => {
                setUserCharacters(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };

    const shuffleCharacters = () => {
       
        const lastShuffle = localStorage.getItem('lastShuffle');
        const shuffleCount = parseInt(localStorage.getItem('shuffleCount') || '0');
        const now = Date.now();
    
        if (lastShuffle && now - lastShuffle < 3600000 && shuffleCount >= shuffleAmount) {
            alert('You can only shuffle characters 10 times per hour');
            return;
        }
    
        if (!lastShuffle || now - lastShuffle >= 3600000) {
            localStorage.setItem('lastShuffle', now.toString());
            localStorage.setItem('shuffleCount', '1');
        } else {
            localStorage.setItem('shuffleCount', (shuffleCount + 1).toString());
        }
    
        localStorage.setItem('lastShuffle', now.toString());
        const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
        setCharacters(shuffledCharacters);
        const selectedCharacterId = shuffledCharacters[0]?.CharacterID;
        if (selectedCharacterId) {
            axios.get(`/api/character/${selectedCharacterId}`)
                .then(response => {
                    setSelectedCharacter(response.data);
                    alert('Character retrieved successfully');
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        }
    };


    const resetTimestamp = () => {
        localStorage.removeItem('lastShuffle');
        localStorage.removeItem('shuffleCount');
        localStorage.removeItem('lastAdd');
        alert('Timestamp and shuffle count reset');
    };

    const addCharacterToUser = () => {
        const lastAdd = localStorage.getItem('lastAdd');
        const now = Date.now();
console.log(lobbyId);
        if (lastAdd && now - lastAdd < 3600000) {
            alert('You can only add a character once per hour');
            return;
        }

        localStorage.setItem('lastAdd', now.toString());

        if (selectedCharacter) {
            axios.post('/api/character/add-to-user', {
                userId: userId,
                characterId: selectedCharacter.CharacterID,
                lobbyId: lobbyId
            })
            .then(response => {
                alert('Character added to user successfully');
            })
            .catch(error => {
                console.error('Error adding character to user: ', error);
                alert('Failed to add character to user');
            });
        }
    };

    return (
        <div>
            <h1>Welcome, {userData.first_name}!</h1>
            <button onClick={shuffleCharacters}>Shuffle Characters</button><p></p>
            <button onClick={getUserCharacters}>View My Characters</button><p></p>
            <button onClick={resetTimestamp}>Reset Timestamp</button><p></p>
            <Link to="/MedalShop">
            <button>Go to Medal Shop</button>
        </Link>

        <Link to="/Home">
            <button>Go to Home</button>
        </Link>

            
            {selectedCharacter && (
                <div>
                    <h2>{selectedCharacter.Character_Name}</h2>
                    
                    <p>{selectedCharacter.Nickname}</p>
                    
                    <p>{selectedCharacter.Origin}</p>
                    <p>{selectedCharacter.Character_Value}</p>
                    
                    <button onClick={addCharacterToUser}>Add Character to User</button>
                    </div>
            )}
            {userCharacters.map(character => (
                <div key={character.CharacterID}>
                    <h2>{character.Character_Name}</h2>
                    <p>{character.Nickname}</p>
                    <p>{character.Origin}</p>
                   
                    <p>{character.Character_Value}</p>
                </div>
            ))}
        </div>
    );
};






// Add more components for other routes here
const collectiveverse = () => {
    
    return (
        <div>
            
            <CharacterList />
            <shuffleCharacters/>
            {/* Add more components for other routes here */}
        </div>
    );
};

export default collectiveverse;
