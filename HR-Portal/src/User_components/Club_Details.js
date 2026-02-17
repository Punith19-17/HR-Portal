import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/ClubDetails.css";

const ClubDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.club) {
    return <h2>Club not found</h2>;
  }

  const { name, lecturer, president, members, events } = state.club;

  return (
    <div className="club-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>{name}</h1>

      <div className="club-info">
        <p><strong>Responsible Lecturer:</strong> {lecturer}</p>
        <p><strong>President:</strong> {president}</p>
      </div>

      <h3>Members</h3>
      <ul>
        {members
          ? members.map((m, i) => <li key={i}>{m}</li>)
          : <li>Total Members: {state.club.members}</li>}
      </ul>

      <h3>Event Calendar</h3>
      <ul>
        {events && events.length > 0
          ? events.map((e, i) => <li key={i}>{e}</li>)
          : <li>No events scheduled</li>}
      </ul>
    </div>
  );
};

export default ClubDetails;
