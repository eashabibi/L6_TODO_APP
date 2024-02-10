import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "./UserContext";
import toast from "react-hot-toast";
import TeamCard from "./TeamCard";

const SessionPage = () => {
  const { id, s_id } = useParams();
  const { csrfToken, userId, TeamDetailsOpen, TeamId, userName } =
    useUserContext();
  const [session, setSession] = useState();
  const [teamForm, setTeamForm] = useState(false);
  const [teams, setTeams] = useState();
  const [sportName, setSportName] = useState();
  const [teamData, setTeamData] = useState({});
  const [players, setPlayers] = useState();
  const [count, setCount] = useState(0);
  const [joinForm, setJoinForm] = useState(false);

  const getPlayersByTeamId = async (TeamId) => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/get-players-by-team-id/${TeamId}`,
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
      setPlayers(data);
    }
  };

  const handleIndvidual = async () => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + "/create-player",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        body: JSON.stringify({
          t_id: TeamId,
          p_name: userName,
        }),
        credentials: "include",
        mode: "cors",
      }
    );
    if (res.ok) {
      toast.success("Joined as indvidual");
      getPlayersByTeamId();
      let teamid = `team-id` + TeamId;
      clickButtonByTeamId(teamid);
    } else if (res.status === 400) {
      toast.error("Player already exists");
    } else {
      toast.error("Something went wrong");
    }
  };

  const getTeamById = async (TeamId) => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/get-team-by-id/${TeamId}`,
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
      setTeamData(data);
    }
  };

  const getSportName = async () => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/get-sport/${s_id}`,
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
      setSportName(data.s_name);
    }
  };

  const getSessionByIdandSportId = async () => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL +
        `/get-session-by-id-and-sport-id/${id}/${s_id}`,
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
      setSession(data);
    }
  };

  const countPlayersByTeamId = async (TeamId) => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/count-players-by-team-id/${TeamId}`,
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
      let data = await res.json();
      data = parseInt(data);
      setCount(data);
    }
  };

  const handleTeamForm = () => {
    setTeamForm(!teamForm);
  };

  const handleJoinForm = () => {
    setJoinForm(!joinForm);
  };

  const handleTeamAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const { t_name, t_size } = data;

    // validation
    if (t_name === "") {
      toast.error("Please enter a team name");
      return;
    }

    if (t_size === "") {
      toast.error("Please enter a team size");
      return;
    }

    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + "/create-team",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        body: JSON.stringify({
          t_name,
          t_size,
          sess_id: id,
        }),
        credentials: "include",
        mode: "cors",
      }
    );

    const resData = await response.json();

    if (response.status === 200) {
      toast.success("Team Added");
      getTeamsBySessionId();
      handleTeamForm();
    }

    if (response.status === 500) {
      toast.error("Something went wrong");
      handleTeamForm();
    }
  };

  const getTeamsBySessionId = async () => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/get-teams-by-session-id/${id}`,
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
      setTeams(data);
    }
  };

  const handleGroupJoin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    // remove empty fields
    for (let key of formData.keys()) {
      if (
        formData.get(key).length === 0 ||
        formData.get(key) === "" ||
        formData.get(key) === null
      ) {
        formData.delete(key);
      }
    }
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + "/create-group-of-players",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        body: JSON.stringify({
          t_id: TeamId,
          players: Object.values(data),
        }),
        credentials: "include",
        mode: "cors",
      }
    );

    if (response.ok) {
      let teamid = `team-id` + TeamId;
      clickButtonByTeamId(teamid);
      toast.success("Joined");
      handleJoinForm();
    } else {
      toast.error("Something went wrong");
      handleJoinForm();
    }
  };

  const clickButtonByTeamId = async (elementID) => {
    const element = document.getElementById(elementID);
    element.click();
  };

  useEffect(() => {
    getSessionByIdandSportId();
    getSportName();
    getTeamsBySessionId();
  }, []);

  return (
    <div className="d-pad">
      {session && (
        <div>
          <h1>{sportName + " / " + session.sess_name}</h1>
          <div className="flex">
            <p>
              <b>Date: </b> {session.date}
            </p>
            <p>
              <b>Start Time: </b> {session.start_time}
            </p>
            <p>
              <b>End Time: </b> {session.end_time}
            </p>
            <p>
              <b>Venue: </b> {session.venue}
            </p>
          </div>
        </div>
      )}
      <div className="flex sbtw">
        <h2>Teams</h2>
        {!teamForm ? (
          <button onClick={handleTeamForm} className="darkbtn">
            {" "}
            Add Team
          </button>
        ) : (
          ""
        )}
      </div>
      {teamForm ? (
        <div>
          <form onSubmit={handleTeamAdd}>
            <input type="text" placeholder="Team Name" name="t_name" />
            <input type="number" placeholder="Team Size" name="t_size" />
            <div className="input-width">
              <button className="darkbtn" type="submit">
                Add Team
              </button>
              <button
                onClick={handleTeamForm}
                type="button"
                className="lightbtn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        ""
      )}

      <div className="grid">
        {teams &&
          teams.map((team) => {
            return (
              <TeamCard
                key={team.id}
                team={team}
                getTeamData={getTeamById}
                getPlayersByTeamId={getPlayersByTeamId}
                countPlayersByTeamId={countPlayersByTeamId}
              />
            );
          })}
      </div>

      {TeamDetailsOpen ? (
        <>
          <div className="flex">
            <div>
              <h2>{teamData.t_name}</h2>
              <p>Team Size: {teamData.t_size}</p>
              <p>Required Players: {teamData.t_size - count}</p>
            </div>
            <div className="flex">
              <button className="darkbtn fitbtn" onClick={handleJoinForm}>
                Join with team
              </button>
              <button className="lightbtn fitbtn" onClick={handleIndvidual}>
                Join as Indvidually
              </button>
            </div>
          </div>
          <div>
            <h3 className="flex">Players</h3>
            <div className="flex2">
              {players &&
                players.map((player) => {
                  return <p key={player.id}>{player.p_name}</p>;
                })}
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      {joinForm && (
        <form className="flex2" onSubmit={handleGroupJoin}>
          {Array.from({ length: teamData.t_size - count }, (_, i) => (
            <input
              key={i}
              type="text"
              placeholder="Player Name"
              name={`p_name_${i}`}
            />
          ))}
          <div className="input-width">
            <button className="darkbtn" type="submit">
              Join
            </button>
            <button className="lightbtn" type="button" onClick={handleJoinForm}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SessionPage;
