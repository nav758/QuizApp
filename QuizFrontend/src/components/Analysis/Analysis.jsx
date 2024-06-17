import React, { useEffect, useState, useContext } from "react";
import { IoShareSocial } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import styles from "./Analysis.module.css";
import { Delete } from "@icon-park/react";
import { getQuizbyUserId, deleteQuiz, updateQuiz } from "../../apis/quiz";
import Questions from "../Questions/Questions";
import Polls from "../Polls/Polls";
import { UserContext } from "../../../utils/UserContext";

function formatDate(createdAt) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const date = new Date(createdAt);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}


function Analysis({ setQuestionsAnalysis }) {
  const [data, setData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [quizType, setQuizType] = useState("");
  const [quizName, setQuizName] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const { setQuizId } = useContext(UserContext);
  const [deleteModel, setDeleteModel] = useState(false);
  const { _id: userId } = user || {};

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getQuizbyUserId(userId);
        setData(response.quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    if (userId) {
      fetchQuizData();
    }
  }, [userId]);

  const handleDelete = async (quizId) => {
    setDeleteModel(true);
    setSelectedQuizId(quizId);
  };

  const handleDeletequiz = async () => {
    try {
      await deleteQuiz(selectedQuizId);
      setData(data.filter((item) => item._id !== selectedQuizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
    setDeleteModel(false);
  };

  const handleShareClick = (quizId) => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(quizLink);
  };

  const handleUpdate = (quizId, quizType, quizName) => {
    setQuizId(quizId);
    setSelectedQuizId(quizId);
    setShowUpdateModal(true);
    setQuizType(quizType);
    setQuizName(quizName);
  };

  const handleUpdatedata = async (updateData) => {
    const quizData = { ...updateData, quizName, quizType };
    if (quizData && selectedQuizId) {
      try {
        const response = await updateQuiz(selectedQuizId, quizData);
        console.log("Quiz updated successfully:", response);
      } catch (error) {
        console.error("Error updating quiz:", error);
      }
    }
    setShowUpdateModal(false);
  };

  const handleAnalysis = (Id) => {
    setQuizId(Id);
    setQuestionsAnalysis(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Quiz Analysis</div>
      <table className={styles.quizTable}>
        <thead>
          <tr>
            <th className={styles.id}>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th></th>
            <th></th>
            <th></th>
            <th className={styles.id_}></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id} className={index % 2 === 0 ? styles.even : styles.odd}>
              <td className={styles.id}>{index + 1}</td>
              <td>{item.quizName}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>{item.impressions}</td>
              <td className={styles.edit} onClick={() => handleUpdate(item._id, item.quizType, item.quizName)}>
                <BiEdit />
              </td>
              <td className={styles.delete} onClick={() => handleDelete(item._id)}>
                <Delete />
              </td>
              <td className={styles.share} onClick={() => handleShareClick(item._id)}>
                <IoShareSocial />
              </td>
              <td className={styles.id_} onClick={() => handleAnalysis(item._id)}>Question Wise Analysis</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showUpdateModal && quizType === "Quiz" && (
        <div>
          <Questions onClose={() => setShowUpdateModal(false)} setupdateQuiz={handleUpdatedata} />
        </div>
      )}
      {showUpdateModal && quizType === "Poll" && (
        <div>
          <Polls onClose={() => setShowUpdateModal(false)} setupdateQuiz={handleUpdatedata} />
        </div>
      )}
      {deleteModel && (
        <div className={styles.deleteModalContainer}>
          <div className={styles.deleteModal}>
            <div>Are you confirm you</div>
            <div>want to delete ?</div>
            <div className={styles.deleteModalBtns}>
              <div onClick={handleDeletequiz}>Confirm Delete</div>
              <div onClick={() => setDeleteModel(false)}>Cancel</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analysis;
