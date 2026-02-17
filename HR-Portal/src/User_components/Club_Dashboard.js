import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ClubDashboard.css";
import { FaUsers, FaCalendarAlt, FaBuilding } from "react-icons/fa";

const Club_Dashboard = () => {
  const navigate = useNavigate();

  const clubs = [
    { id: 1, name: "MCA Student Association", members: 45, type: "Academic", lecturer: "Dr. Anita Sharma", president: "Rahul Kumar", events: ["Orientation Day - Sept 5", "Annual Meet - Nov 20"] },
    { id: 2, name: "CodeCraft MCA", members: 32, type: "Technical", lecturer: "Prof. Suresh Iyer", president: "Ananya Rao", events: ["Hackathon - Oct 10", "Workshop - Dec 2"] },
    { id: 3, name: "MCA Innovation Hub", members: 28, type: "Innovation", lecturer: "Dr. Sunil Menon", president: "Priya S", events: ["Project Expo - Oct 25"] },
    { id: 4, name: "Data Science Society", members: 25, type: "Research", lecturer: "Prof. Meera", president: "Vikram P", events: ["Data Fest - Nov 15"] },
    { id: 5, name: "MCA Cultural Committee", members: 38, type: "Cultural", lecturer: "Dr. Anitha Rao", president: "Sneha R", events: ["Cultural Fest - Dec 5"] },
  ];

  return (
    <div className="club-dashboard">
      {/* Navbar */}
      <div className="club-navbar">
        <button className="active">Clubs</button>
        <button>Events</button>
        <button className="create-btn">+ Create Club</button>
      </div>

      {/* Stats */}
      <div className="club-stats">
        <div className="stat-card">
          <FaBuilding className="stat-icon" />
          <div>
            <h3>Active Clubs</h3>
            <p>{clubs.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div>
            <h3>Upcoming Events</h3>
            <p>3</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div>
            <h3>Total Members</h3>
            <p>250</p>
          </div>
        </div>
      </div>

      {/* Clubs Scrollable Container */}
      <div className="department-section">
        <h2>MCA Department Clubs</h2>
        <div className="club-container">
          {clubs.map((club) => (
            <div key={club.id} className="club-item">
              <div className="club-number">{club.id}</div>
              <div className="club-info">
                <h3>{club.name}</h3>
                <p>👥 {club.members} members</p>
                <span className="club-type">{club.type}</span>
              </div>
              <div className="club-actions">
                <button
                  className="view-btn"
                  onClick={() =>
                    navigate(`/club/${club.id}`, { state: { club } })
                  }
                >
                  View
                </button>
                <button
                  className="join-btn"
                  onClick={() =>
                    navigate(`/club/${club.id}`, { state: { club } })
                  }
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Club_Dashboard;