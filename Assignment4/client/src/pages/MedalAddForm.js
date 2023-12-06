// MedalAddForm.jsx
import React, { useState } from 'react';

const MedalAddForm = ({ onAdd }) => {
  const [newMedal, setNewMedal] = useState({
    Medal_Name: '',
    Color: '',
    Cost: 0,
    Medal_Icon: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedal({ ...newMedal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newMedal);
    setNewMedal({
      Medal_Name: '',
      Color: '',
      Cost: 0,
      Medal_Icon: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Medal Name:
        <input
          type="text"
          name="Medal_Name"
          value={newMedal.Medal_Name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Color:
        <input
          type="text"
          name="Color"
          value={newMedal.Color}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Cost:
        <input
          type="number"
          name="Cost"
          value={newMedal.Cost}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Medal Icon URL:
        <input
          type="text"
          name="Medal_Icon"
          value={newMedal.Medal_Icon}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Add Medal</button>
    </form>
  );
};

export default MedalAddForm;
