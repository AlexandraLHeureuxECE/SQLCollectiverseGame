import React, { useState, useEffect } from 'react';

function Trades() {
    const [characters, setCharacters] = useState([]);
    const [tradeRequests, setTradeRequests] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const [tradeMessage, setTradeMessage] = useState('');

    const userId = ''; // Replace with the logged-in user's ID
    const lobbyId = ''; // Replace with the current lobby's ID

    // Fetch characters that the user has within a lobby
    useEffect(() => {
        fetch(`/api/user/${userId}/lobby/${lobbyId}`)
            .then(response => response.json())
            .then(data => setCharacters(data))
            .catch(error => console.error('Error fetching characters:', error));

        // Fetch trade requests sent to the user
        fetch(`/api/trades/requests/${userId}`)
            .then(response => response.json())
            .then(data => setTradeRequests(data))
            .catch(error => console.error('Error fetching trade requests:', error));
    }, [userId, lobbyId]);

    // Function to send a trade request
    const sendTradeRequest = () => {
        const requestBody = {
            User1ID: userId,
            User2ID: targetUserId,
            Char1ID: selectedCharacter,
            // Char2ID: The character offered by the target user, requires additional UI for selection
            TradeMessage: tradeMessage,
            // Other required fields...
        };

        fetch('/api/trades/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error sending trade request:', error));
    };

    // Function to accept a trade request
    const acceptTradeRequest = (tradeId) => {
        fetch(`/api/trades/accept/${tradeId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error accepting trade:', error));
    };

    // Function to reject a trade request
    const rejectTradeRequest = (tradeId) => {
        fetch(`/api/trades/reject/${tradeId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error rejecting trade:', error));
    };

    return (
        <div>
            <h2>Send Trade Request</h2>
            <select onChange={(e) => setSelectedCharacter(e.target.value)}>
                {characters.map(character => (
                    <option key={character.CharacterID} value={character.CharacterID}>{character.CharacterName}</option>
                ))}
            </select>
            <input type="text" placeholder="Target User ID" onChange={(e) => setTargetUserId(e.target.value)} />
            <textarea placeholder="Trade Message" onChange={(e) => setTradeMessage(e.target.value)}></textarea>
            <button onClick={sendTradeRequest}>Send Trade Request</button>

            <h2>Incoming Trade Requests</h2>
            {tradeRequests.map(request => (
                <div key={request.TradeID}>
                    <p>From User: {request.User1ID}, Message: {request.TradeMessage}</p>
                    <button onClick={() => acceptTradeRequest(request.TradeID)}>Accept</button>
                    <button onClick={() => rejectTradeRequest(request.TradeID)}>Reject</button>
                </div>
            ))}
        </div>
    );
}

export default Trades;