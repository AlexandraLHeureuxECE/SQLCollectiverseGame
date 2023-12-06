// collectiveverse.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [userCharacters, setUserCharacters] = useState([]);
    const userId =  2; // Replace with your user ID
    const lobbyId = 1000; // Replace with your lobby ID
    const shuffleAmount=10;
    const [selectedCharacterId, setSelectedCharacterId] = useState(null);

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
    useEffect(() => {
        axios.get('/api/character')
            .then(response => {
                setCharacters(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);



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
            <button onClick={shuffleCharacters}>Shuffle Characters</button>
            <button onClick={getUserCharacters}>View My Characters</button><p></p>
            <button onClick={resetTimestamp}>Reset Timestamp</button>

            <select onChange={e => setSelectedCharacterId(e.target.value)}>
                <option value="">Select a character to delete</option>
                {userCharacters.map(character => (
                    <option key={character.CharacterID} value={character.CharacterID}>
                        {character.Character_Name}
                    </option>
                ))}
            </select>
            <button onClick={deleteCharacter}>Delete Character</button>
            {selectedCharacter && (
                <div>
                    <h2>{selectedCharacter.Character_Name}</h2>
                    <p>{selectedCharacter.Character_Value}</p>
                    <button onClick={addCharacterToUser}>Add Character to User</button>
                    </div>
            )}
            {userCharacters.map(character => (
                <div key={character.CharacterID}>
                    <h2>{character.Character_Name}</h2>
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
