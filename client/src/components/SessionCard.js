import React from "react";
import { useNavigate } from "react-router-dom";

const SessionCard = ({ session }) => {
  const navigate = useNavigate();
  const handleSessionPage = () => {
    navigate(`/sport/${session.s_id}/session/${session.id}`);
  };
  return (
    <div className="sport-card card2">
      <h2>{session.sess_name}</h2>
      <div className="flex">
        <b>Date</b> <p>{session.date}</p>
      </div>
      <div className="flex">
        <b>Start Time</b> <p>{session.start_time}</p>
      </div>
      <div className="flex">
        <b>End Time</b> <p>{session.end_time}</p>
      </div>
      <div className="flex">
        <b>Venue</b> <p>{session.venue}</p>
      </div>
      <button className="darkbtn" onClick={handleSessionPage}>
        Join Session
      </button>
    </div>
  );
};

export default SessionCard;
