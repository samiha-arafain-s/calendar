import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import AddEventModal from './AddEventModal';
import initialEvents from '../data/events.json';

const LS_KEY = 'my-calendar-events';

export default function Calendar() {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? JSON.parse(stored) : initialEvents;
  });

  const [editData, setEditData] = useState(null);

  const [currentDate, setCurrentDate] = useState(() => {
  const stored = localStorage.getItem('current-month');
  return stored ? dayjs(stored) : dayjs();
});

  const [selectedDate, setSelectedDate] = useState(() => {
  const stored = localStorage.getItem('selected-date');
  return stored || null;
});

  const [showModal, setShowModal] = useState(false);
  const getRandomColor = () => {
  const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'];
  return colors[Math.floor(Math.random() * colors.length)];
};

  useEffect(() => {
  if (selectedDate) {
    localStorage.setItem('selected-date', selectedDate);
  }
}, [selectedDate]);

  const handleSaveEvent = (eventData, editIndex = null) => {
  const eventWithDetails = {
    ...eventData,
    date: selectedDate,
    color: editIndex !== null ? events[editIndex].color : getRandomColor(),
  };

  let updatedEvents = [...events];
  if (editIndex !== null) {
    updatedEvents[editIndex] = eventWithDetails;
  } else {
    updatedEvents.push(eventWithDetails);
  }

  setEvents(updatedEvents);
  setShowModal(false);
};

const handleDeleteEvent = (index) => {
  if (window.confirm('Delete this event?')) {
    const updated = events.filter((_, i) => i !== index);
    setEvents(updated);
  }
};
const handleEditEvent = (index) => {
  const event = events[index];
  setSelectedDate(event.date);
  setEditData({ ...event, index });
  setShowModal(true);
};

  const start = currentDate.startOf('month').startOf('week');
  const end = currentDate.endOf('month').endOf('week');
  const boxes = [];
  let d = start;

  while (d.isBefore(end) || d.isSame(end)) {
    const iso = d.format('YYYY-MM-DD');
    const dayEventCount = events.filter((e) => e.date === iso).length;

    boxes.push(
      <div
        key={iso}
        className={`day-box ${d.isSame(dayjs(), 'day') ? 'today' : ''}`}
        onClick={() => {
          setSelectedDate(iso);
          setShowModal(true);
        }}
      >
        <div>{d.date()}</div>
        {events
  .map((e, i) => ({ ...e, index: i })) // include index
  .filter((e) => e.date === iso)
  .map((event) => (
    <div
      key={event.index}
      className="event-badge"
      style={{ backgroundColor: event.color || '#4f46e5' }}
    >
      <span>{event.title}</span>
      <div className="badge-buttons">
        <button onClick={() => handleEditEvent(event.index)}>✏️</button>
        <button onClick={() => handleDeleteEvent(event.index)}>🗑️</button>
      </div>
    </div>
))}
      </div>
    );
    d = d.add(1, 'day');
  }
  return (
    <div className="calendar-container">
      
      <div className="calendar-main">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>‹</button>
          <h2>{currentDate.format('MMMM YYYY')}</h2>
          <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>›</button>
        </div>
        <div className="weekday-row">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>
        <div className="calendar-grid">{boxes}</div>
      </div>
      {showModal && (
  <AddEventModal
    date={selectedDate}
    onSave={handleSaveEvent}
    onClose={() => {
      setShowModal(false);
      setEditData(null);
    }}
    editData={editData}
  />
)}
    </div>
  );
}
