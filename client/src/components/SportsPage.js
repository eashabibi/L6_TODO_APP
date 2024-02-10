import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "./UserContext";
import toast from "react-hot-toast";
import SessionCard from "./SessionCard";

const SportsPage = () => {
  const { id } = useParams();
  const { csrfToken, userId } = useUserContext();
  const [sport, setSport] = useState();
  const [sessionForm, setSessionForm] = useState(false);
  const [sessions, setSessions] = useState();

  const getSportById = async () => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/get-sport/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        credentials: "include",
        mode: "cors",
      }
    );
    if (res.ok) {
      const data = await res.json();
      setSport(data);
    }
  };

  const handleSessionForm = () => {
    setSessionForm(!sessionForm);
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const { sess_name, date, start_time, end_time, venue } = data;

    // validation
    if (sess_name === "") {
      toast.error("Please enter a session name");
      return;
    }

    if (date === "") {
      toast.error("Please enter a date");
      return;
    }

    if (start_time === "") {
      toast.error("Please enter a start time");
      return;
    }

    if (end_time === "") {
      toast.error("Please enter an end time");
      return;
    }

    if (venue === "") {
      toast.error("Please enter a venue");
      return;
    }

    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + "/create-session",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        body: JSON.stringify({
          sess_name,
          s_id: id,
          userId,
          date,
          start_time,
          end_time,
          venue,
        }),
        credentials: "include",
        mode: "cors",
      }
    );
    if (response.ok) {
      const data = await response.json();
      toast.success("Session Created");
      handleSessionForm();
      getSessionsBySportId();
    } else {
      toast.error("Something went wrong");
    }
  };

  const getSessionsBySportId = async () => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/get-sessions-by-sport-id/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        credentials: "include",
        mode: "cors",
      }
    );
    if (res.ok) {
      const data = await res.json();
      setSessions(data);
    }
  };

  useEffect(() => {
    getSportById();
    getSessionsBySportId();
  }, []);

  return (
    <div className="d-pad">
      <div className="flex sbtw">
        <h1>{sport?.s_name}</h1>
        {sessionForm ? (
          ""
        ) : (
          <button onClick={handleSessionForm} className="darkbtn fitbtn">
            Create Sessions
          </button>
        )}
      </div>
      {sessionForm ? (
        <div>
          <form onSubmit={handleCreateSession}>
            <input type="text" name="sess_name" placeholder="Session Name" />
            <input type="date" name="date" />
            <input type="time" name="start_time" />
            <input type="time" name="end_time" />
            <input type="text" name="venue" placeholder="Venue" />
            <div className="input-width">
              <button className="darkbtn fitbtn" type="submit">
                Create Session now:
              </button>
              <button
                className="lightbtn fitbtn"
                type="button"
                onClick={handleSessionForm}
              >
                Cancel Session
              </button>
            </div>
          </form>
        </div>
      ) : (
        ""
      )}
      <h2>Sessions</h2>
      <div className="grid col">
        {sessions?.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};

export default SportsPage;
