import React, { useState, useEffect } from 'react';
import CharacterUpdateForm from './CharacterUpdateForm';
import CharacterAddForm from './CharacterAddForm';
import MedalAddForm from './MedalAddForm';
import '../cssFiles/Admin.css';

function Admin() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [medals, setMedals] = useState([]); 
  const [expandedAdmin, setExpandedAdmin] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [expandedCharacter, setExpandedCharacter] = useState(null);
  const [expandedMedal, setExpandedMedal] = useState(null);

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

    // Fetching all the characters from the backend
    const fetchCharacters = async () => {
        try {
            const response = await fetch('/api/character');
            if (response.ok) {
                const charactersData = await response.json();
                setCharacters(charactersData);
            } else {
                console.error('Failed to fetch characters:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred during fetch:', error);
        }
    }
    
    fetchCharacters();

    // Fetching all the medals from the backend
    const fetchMedals = async () => {
        try {
            const response = await fetch('/api/medal');
            if (response.ok) {
                const medalsData = await response.json();
                setMedals(medalsData);
            } else {
                console.error('Failed to fetch medals:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred during fetch:', error);
        }
    }

    fetchMedals();
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

  const toggleExpandedCharacter = (character) => {
    // Toggle the expandedCharacter state for the clicked character
    setExpandedCharacter((prevExpandedCharacter) =>
        prevExpandedCharacter === character.CharacterID ? null : character.CharacterID
    );
    };

    const toggleExpandedMedal = (medal) => {
        // Toggle the expandedMedal state for the clicked medal
        setExpandedMedal((prevExpandedMedal) =>
          prevExpandedMedal === medal.MedalID ? null : medal.MedalID
        );
      };

  const handleDeleteUser = async (userID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/users/${userID}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('User deleted successfully');
          // Refresh the user list after deletion
          const updatedUsers = users.filter((user) => user.UserID !== userID);
          setUsers(updatedUsers);
        } else {
          const errorData = await response.json();
          console.error('Delete failed:', errorData.error);
        }
      } catch (error) {
        console.error('An error occurred during delete:', error);
      }
    }
  };

    const handleAddCharacter = async (newCharacter) => {
        try {
            const response = await fetch('/api/character/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCharacter),
            });

            if (response.ok) {
                alert('Character added successfully');
                // Refresh the character list after adding
                const character = await response.json();
                setCharacters([...characters, character]);
            } else {
                const errorData = await response.json();
                console.error('Add failed:', errorData.error);
                alert('Add failed');
            }
        } catch (error) {
            console.error('An error occurred during add:', error);
        }
    };
    
  const handleDeleteCharacter = async (characterID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this character?');

    if (confirmDelete) {
        try {
            const response = await fetch(`/api/character/${characterID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Character deleted successfully');
                // Refresh the character list after deletion
                const updatedCharacters = characters.filter((character) => character.CharacterID !== characterID);
                setCharacters(updatedCharacters);
            } else {
                const errorData = await response.json();
                console.error('Delete failed:', errorData.error);
            }
        } catch (error) {
            console.error('An error occurred during delete:', error);
        }
    }
};

  const handleUpdateCharacter = async (updatedCharacter) => {
    try {
      const response = await fetch(`/api/character/${updatedCharacter.CharacterID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCharacter),
      });

      console.log(updatedCharacter);

      if (response.ok) {
        alert('Character updated successfully');
        // Refresh the character list after update
        const updatedCharacters = characters.map((c) =>
          c.CharacterID === updatedCharacter.CharacterID ? updatedCharacter : c
        );
        setCharacters(updatedCharacters);
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData.error);
        alert('Update failed');
      }
    } catch (error) {
      console.error('An error occurred during update:', error);
    }
  };

  const handleAddMedal = async (newMedal) => {
    try {
      const response = await fetch('/api/medal/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedal),
      });

      if (response.ok) {
        alert('Medal added successfully');
        // Refresh the medal list after adding
        const medal = await response.json();
        setMedals([...medals, medal]);
        //Refresh page
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Add failed:', errorData.error);
        alert('Add failed');
      }
    } catch (error) {
      console.error('An error occurred during add:', error);
    }
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
                  <button onClick={() => handleDeleteUser(user.UserID)}>Delete User</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCharacterList = () => {
    return (
        <div>
          <h2>Character List</h2>
            <CharacterAddForm onAdd={handleAddCharacter} />
          <ul>
            {characters.map((character) => (
            <li key={character.CharacterID}>
              <span className="toggle-button" onClick={() => toggleExpandedCharacter(character)}>
                {expandedCharacter === character.CharacterID ? '▼' : '►'}
              </span>
              {character.Character_Name}
              {expandedCharacter === character.CharacterID && (
                <div className="expanded-details">
                  <p>Character ID: {character.CharacterID}</p>
                  <p>Character Value: {character.Character_Value}</p>
                  <p>Origin: {character.Origin}</p>
                  {character.Char_Icon && (
                    <div>
                    <p>Character Image:</p>
                    <img 
                      src={character.Char_Icon} 
                      alt={`Character ${character.Character_Name}`} 
                      style={{ width: '120px', height: '120px' }} 
                    />
                  </div>
                )}
                  <CharacterUpdateForm character={character} onUpdate={handleUpdateCharacter} />
                  <button onClick={() => handleDeleteCharacter(character.CharacterID)}>Delete Character</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderMedalList = () => {
    return (
      <div>
        <h2>Medal List</h2>
        <MedalAddForm onAdd={handleAddMedal} />
        <ul>
          {medals.map((medal) => (
            <li key={medal.MedalID}>
              <span className="toggle-button" onClick={() => toggleExpandedMedal(medal)}>
                {expandedMedal === medal.MedalID ? '▼' : '►'}
              </span>
              {medal.MedalName}
              {expandedMedal === medal.MedalID && (
                <div className="expanded-details">
                  <p>Medal ID: {medal.MedalID}</p>
                  <p>Medal Name: {medal.MedalName}</p>
                  <p>Color: {medal.Color}</p>
                  <p>Cost: {medal.Cost}</p>
                  {medal.Icon && (
                    <div>
                      <p>Medal Image:</p>
                      <img
                        src={medal.Icon}
                        alt={`Medal ${medal.MedalName}`}
                        style={{ width: '120px', height: '120px' }}
                      />
                    </div>
                  )}
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
      {renderCharacterList()}
      {renderMedalList()}
    </div>
  );
}

export default Admin;
