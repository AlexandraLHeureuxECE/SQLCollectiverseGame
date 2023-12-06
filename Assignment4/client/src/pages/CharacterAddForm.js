import React, { useState } from 'react';

const CharacterAddForm = ({ onAdd}) => {
  const [newCharacter, setNewCharacter] = useState({
    Character_Name: '',
    Character_Value: '',
    Char_Icon: '',
    Nickname: '',
    Origin: '',
    AdminID: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter({ ...newCharacter, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newCharacter);
    setNewCharacter({
      Character_Name: '',
      Character_Value: '',
      Char_Icon: '',
      Nickname: '',
      Origin: '',
      AdminID: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Character Name:
        <input
          type="text"
          name="Character_Name"
          value={newCharacter.Character_Name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Character Value:
        <input
          type="text"
          name="Character_Value"
          value={newCharacter.Character_Value}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Character Icon URL:
        <input
          type="text"
          name="Char_Icon"
          value={newCharacter.Char_Icon}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Nickname:
        <input
          type="text"
          name="Nickname"
          value={newCharacter.Nickname}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Origin:
        <input
          type="text"
          name="Origin"
          value={newCharacter.Origin}
          onChange={handleInputChange}
        />
      </label>
      <label>
        AdminID:
        <input
          type="text"
          name="AdminID"
          value={newCharacter.AdminID}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Add Character</button>
    </form>
  );
};

export default CharacterAddForm;
