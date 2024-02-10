import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SportCard = ({ sportdata, isAdmin, csrfToken, getSports }) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + `/delete-sport/${sportdata.id}`,
      {
        method: "DELETE",
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
      toast.success("Sport Deleted");
      getSports();
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleSession = () => {
    navigate(`/sport/${sportdata.id}`);
  };

  return (
    <div className="sport-card">
      {isAdmin ? <span onClick={handleDelete}>X</span> : null}
      <h2>{sportdata.s_name}</h2>
      <button className="lightbtn sbtn" onClick={handleSession}>
        Create Session:
      </button>
    </div>
  );
};

export default SportCard;
