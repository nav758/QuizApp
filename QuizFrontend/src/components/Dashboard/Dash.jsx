import React, { useEffect, useState } from "react";
import style from "./Dash.module.css";
import { Eyes } from "@icon-park/react";
import { useNavigate } from "react-router-dom";
import { getAllQuiz, getQuizbyUserId } from "../../apis/quiz";

function formatDate(dateString) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const date = new Date(dateString);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

function formatNumber(number) {
  if (number >= 1000) {
    return (number / 1000).toFixed(2) + "K";
  } else {
    return number;
  }
}

function Dash() {
  const [quizzes, setQuizzes] = useState([]);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const { _id: userId } = user || {};

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const allQuizzesResponse = await getAllQuiz();
        setQuizzes(allQuizzesResponse.quizzes);

        if (userId) {
          const userQuizzesResponse = await getQuizbyUserId(userId);
          setUserQuizzes(userQuizzesResponse.quiz);
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const handleShowQuiz = (quizId) => {
    navigate("/quiz", { state: { quizId } });
  };

  return (
    <div className={style.container}>
      <div className={style.heading_container}>
        <div className={style.stats1}>
          <div>
            <h1 className={style.headingQuiz}>
              <span>{formatNumber(userQuizzes.length)}</span> Quiz
            </h1>
            Created
          </div>
        </div>
        <div className={style.stats2}>
          <div>
            <h1 className={style.headingQuestion}>
              <span>
                {formatNumber(
                  userQuizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)
                )}
              </span> 
              questions
            </h1>
            Created
          </div>
        </div>
        <div className={style.stats3}>
          <div>
            <h1 className={style.headingImpression}>
              <span>
                {formatNumber(
                  userQuizzes.reduce((acc, quiz) => acc + quiz.impressions, 0)
                )}
              </span> 
              Total
            </h1>
            Impressions
          </div>
        </div>
      </div>
      <div className={style.trendingQuize}>
        <h1>Trending Quizzes</h1>
        <div className={style.quizes}>
          {quizzes.map((quiz) => (
            <div className={style.card} key={quiz._id} onClick={() => handleShowQuiz(quiz._id)}>
              <div>
                <span>{quiz.quizName}</span>
              </div>
              <div className={style.eyes}>
                {formatNumber(quiz.impressions)} <Eyes />
              </div>
              <div className={style.date}>
                Created on: {formatDate(quiz.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dash;
