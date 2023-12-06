import React, { useState } from 'react';

const CharacterUpdateForm = ({ character, onUpdate }) => {
  const [updatedCharacter, setUpdatedCharacter] = useState({
    CharacterID: character.CharacterID,
    Character_Name: character.Character_Name,
    Character_Value: character.Character_Value,
    Char_Icon: character.Char_Icon,
    Nickname: character.Nickname,
    Origin: character.Origin,
    AdminID: character.AdminID,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCharacter({ ...updatedCharacter, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedCharacter);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Character Name:
        <input
          type="text"
          name="Character_Name"
          value={updatedCharacter.Character_Name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Character Value:
        <input
          type="text"
          name="Character_Value"
          value={updatedCharacter.Character_Value}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Character Icon URL:
        <input
          type="text"
          name="Char_Icon"
          value={updatedCharacter.Char_Icon}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Nickname:
        <input
          type="text"
          name="Nickname"
          value={updatedCharacter.Nickname}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Origin:
        <input
          type="text"
          name="Origin"
          value={updatedCharacter.Origin}
          onChange={handleInputChange}
        />
      </label>
      <label>
        AdminID:
        <input
          type="text"
          name="AdminID"
          value={updatedCharacter.AdminID}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Update Character</button>
    </form>
  );
};

export default CharacterUpdateForm;
