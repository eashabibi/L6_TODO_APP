import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import toast from "react-hot-toast";
import SportCard from "./SportCard";

const DashBoard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [AdminId, setAdminId] = useState();
  const [s_name, setS_name] = useState("");
  const [sports, setSports] = useState();

  const { userEmail, csrfToken, userName } = useUserContext();
  const [sportForm, setSportForm] = useState(false);

  const handleSportForm = () => {
    setSportForm(!sportForm);
  };

  const checkAdmin = async () => {
    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + "/check-admin",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        body: JSON.stringify({ email: userEmail }),
        credentials: "include",
        mode: "cors",
      }
    );
    const data = await response.json();
    setIsAdmin(data.isAdmin);
    setAdminId(data.adminId);
  };

  const handleChange = (e) => {
    if (e.keyDown === "Enter") {
      handleAddSport();
    }
    setS_name(e.target.value);
  };

  const handleAddSport = async () => {
    if (s_name === "") {
      toast.error("Please enter a sport name");
      return;
    }
    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + "/create-sport",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": csrfToken,
        },
        body: JSON.stringify({ s_name, adminId: AdminId }),
        credentials: "include",
        mode: "cors",
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      toast.success("Sport Added");
      getSports();
      handleSportForm();
    } else {
      toast.error("Something went wrong");
      handleSportForm();
    }
  };

  const getSports = async () => {
    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + "/get-sports",
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

    const data = await response.json();
    setSports(data);
  };

  useEffect(() => {
    checkAdmin();
    getSports();
  }, [userEmail]);

  return (
    <div className="d-pad">
      <div className="flex sbtw">
        {isAdmin ? <h1>Admin Dashboard</h1> : <h1>User Dashboard</h1>}
        <div className="flex">
          {sportForm ? (
            <div>
              <input
                type="text"
                placeholder="Sport Name"
                name="s_name"
                onChange={handleChange}
              />
            </div>
          ) : null}

          {isAdmin && !sportForm ? (
            <button onClick={handleSportForm} className="darkbtn">
              {" "}
              Add Sport
            </button>
          ) : (
            ""
          )}

          {sportForm ? (
            <button onClick={handleAddSport} className="darkbtn">
              {" "}
              Add
            </button>
          ) : (
            ""
          )}

          {sportForm ? (
            <button onClick={handleSportForm} className="lightbtn">
              Cancel
            </button>
          ) : null}
        </div>
      </div>
      <div>
        <h1>Sports</h1>
        <div className="grid">
          {sports &&
            sports.map((sport) => {
              return (
                <SportCard
                  key={sport.id}
                  sportdata={sport}
                  isAdmin={isAdmin}
                  csrfToken={csrfToken}
                  getSports={getSports}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
