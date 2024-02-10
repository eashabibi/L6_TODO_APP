import React from "react";
import { useUserContext } from "./UserContext";

const TeamCard = ({
  team,
  getTeamData,
  getPlayersByTeamId,
  countPlayersByTeamId,
}) => {
  const { setTeamDetailsOpen, setTeamId } = useUserContext();

  const handleTeamDetails = () => {
    setTeamDetailsOpen(true);
    setTeamId(team.id);
    getTeamData(team.id);
    getPlayersByTeamId(team.id);
    countPlayersByTeamId(team.id);
  };
  return (
    <div className="sport-card col1">
      <h2>{team.t_name}</h2>
      <div className="flex">
        <b>Team Size</b> <p>{team.t_size}</p>
      </div>
      <button className="darkbtn" id={`team-id`+team.id} onClick={handleTeamDetails}>
        View Team
      </button>
    </div>
  );
};

export default TeamCard;
