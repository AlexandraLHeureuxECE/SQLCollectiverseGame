import React, {
    useState,
    useEffect
} from 'react';

const MedalShop = () => {
    const [medals, setMedals] = useState([]);
    const [userCharacters, setUserCharacters] = useState([]);
    const [userMedals, setUserMedals] = useState([]);
    const [selectedMedal, setSelectedMedal] = useState(null);

    useEffect(() => {
        // Fetch all available medals from the backend
        fetch('http://localhost:3000/api/medal')
            .then(response => response.json())
            .then(data => setMedals(data))
            .catch(error => console.error('Error fetching medals: ', error));

        // Fetch characters and medals of the logged-in user

        // TO BE EDITED WHEN CONNECTED WITH OTHER CODE
        const userArray = JSON.parse(localStorage.getItem('user'));
        const userId = userArray[0].UserID;
        const lobbyId = 1000;






        fetch(`http://localhost:3000/api/character/user/${userId}/lobby/${lobbyId}`)
            .then(response => response.json())
            .then(data => setUserCharacters(data))
            .catch(error => console.error('Error fetching user characters: ', error));

        fetch(`http://localhost:3000/api/medal/user/${userId}/lobby/${lobbyId}`)
            .then(response => response.json())
            .then(data => setUserMedals(data))
            .catch(error => console.error('Error fetching user medals: ', error));
    }, []); // Run only once when the component mounts

    const calculateUserCharacterValue = () => {
        // Calculate the cumulative value of characters the user possesses
        return userCharacters.reduce((totalValue, character) => totalValue + parseFloat(character.Character_Value), 0);
    };

    const handleMedalSelect = (medal) => {
        setSelectedMedal(medal);
    };

    const handleClaimMedal = () => {
        // Check if the user has enough character value to claim the selected medal
        if (calculateUserCharacterValue() >= selectedMedal.Cost) {
            // Make a backend request to add the selected medal to the user











            // TO BE EDITED WHEN CONNECTED WITH OTHER CODE
            const userArray = JSON.parse(localStorage.getItem('user'));
            const userId = userArray[0].UserID;
            const lobbyId = 1000;










            fetch('http://localhost:3000/api/medal/add-to-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        medalId: selectedMedal.MedalID,
                        lobbyId: lobbyId,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    alert('Medal claimed successfully');
                    // Refresh user medals
                    fetch(`http://localhost:3000/api/medal/user/${userId}/lobby/${lobbyId}`)
                        .then(response => response.json())
                        .then(data => setUserMedals(data))
                        .catch(error => console.error('Error fetching user medals: ', error));
                })
                .catch(error => {
                    console.error('Error claiming medal: ', error);
                    alert('Failed to claim medal');
                });
        } else {
            alert('Insufficient character value to claim the selected medal');
        }
    };

    return (
        <div>
          <h1>Medal Shop</h1>
          <div>
            <h2>Available Medals</h2>
            <ul>
              {medals.map(medal => (
                <li key={medal.MedalID} onClick={() => handleMedalSelect(medal)}>
                  {medal.MedalName} - Cost: {medal.Cost}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>User Characters</h2>
            <ul>
              {userCharacters.map(character => (
                <li key={character.CharacterID}>
                  {character.Character_Name} - Value: {character.Character_Value}
                </li>
              ))}
            </ul>
            <p>Cumulative Character Value: {calculateUserCharacterValue()}</p>
          </div>
          {selectedMedal && (
            <div>
              <h2>Selected Medal</h2>
              <p>{selectedMedal.Medal_Name} - Cost: {selectedMedal.Cost}</p>
              <button onClick={handleClaimMedal}>Claim Medal</button>
            </div>
          )}
          <div>
            <h2>User Medals</h2>
            <ul>
              {userMedals.map(userMedal => (
                <li key={userMedal.MedalID}>
                  {userMedal.Medal_Name}
                </li>
              ))}
            </ul>
          </div>
        </div>
    );
};

export default MedalShop;