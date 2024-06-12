import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Sidebar.module.css";
import { UserContext } from "../../../utils/UserContext";
function Sidebar({ setDash, setAnalytics, setCreate }) {
  const [dash, setDash_] = useState(true);
  const [analytics, setAnalytics_] = useState(false);
  const [create, setCreate_] = useState(false);
  const navigate = useNavigate();
  const { setQuizId } = useContext(UserContext);
  const handledash = () => {
    setDash_(true);
    setAnalytics_(false);
    setCreate_(false);
  };
  const handleAnalytics = () => {
    setDash_(false);
    setAnalytics_(true);
    setCreate_(false);
  };
  const handleCreate = () => {
    setDash_(false);
    setAnalytics_(false);
    setCreate_(true);
    setQuizId(null);
  };

  const handleLogout = () => {
    
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <div className={style.overlay}>
        <div className={style.heading}>QUIZZIE</div>
        <div className={style.container}>
          <div className={style.button} onClick={setDash}>
            <div className={dash && style.active} onClick={handledash}>
              Dashboard
            </div>{" "}
          </div>
          <div className={style.button} onClick={setAnalytics}>
            <div
              className={analytics && style.active}
              onClick={handleAnalytics}
            >
              Analytics
            </div>{" "}
          </div>
          <div className={style.button} onClick={setCreate}>
            <div className={create && style.active} onClick={handleCreate}>
              Create Quiz
            </div>{" "}
          </div>
        </div>
        <div className={style.Logout}>
          <hr />
          <div className={style.button} onClick={() => handleLogout()}>LOGOUT</div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
