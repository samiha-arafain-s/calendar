import React, { useState, useEffect } from 'react';

export default function AddEventModal({ date, onSave, onClose, editData }) {
  const [title, setTitle] = useState(editData?.title || '');
  const [time, setTime] = useState(editData?.time || '');
  const [email, setEmail] = useState(editData?.email || '');

  const handleSubmit = () => {
    if (!title || !time || !email) return alert('Fill all fields!');
    const event = { title, time, email };
    if (editData && editData.index !== undefined) {
      onSave(event, editData.index); // edit mode
    } else {
      onSave(event); // add mode
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{editData ? 'Edit Event' : `Add Event on ${date}`}</h3>
        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>{editData ? 'Update' : 'Add'}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
