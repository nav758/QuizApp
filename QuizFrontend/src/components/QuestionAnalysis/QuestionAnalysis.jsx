import React, { useEffect, useState, useContext } from "react";
import { getQuizbyId } from "../../apis/quiz";
import { getAttempt } from "../../apis/Attempt";
import style from "./QuestionAnalysis.module.css";
import { UserContext } from "../../../utils/UserContext";

function formatDate(createdAtDate) {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(createdAtDate);
    const day = date.toLocaleDateString("en-US", { day: "2-digit" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }
  
function QuestionAnalysis() {
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [quiztype, setQuiztype] = useState("Quiz");
  const { quizId } = useContext(UserContext);

  useEffect(() => {
    const fetchQuizAndAttempt = async () => {
      try {
        const quizData = await getQuizbyId(quizId);
        const attemptData = await getAttempt(quizId);

        if (quizData && quizData.quiz) {
          setQuiz(quizData.quiz);
          setQuiztype(quizData.quiz.quizType);
        }

        if (attemptData) {
          setAttempt(attemptData);
        }
      } catch (error) {
        console.error("Error fetching quiz or attempt data:", error);
      }
    };

    fetchQuizAndAttempt();
  }, [quizId]);

  if (!quiz || !attempt) return <div>Loading...</div>;

  

  const { quizName, impressions, questions, createdAt } = quiz;
 
  const { correctCounts, totalAttempts, attempts: attemptData } = attempt;
  const createdAtDate = new Date(createdAt);
  
  return (
    <div className={style.container}>
      <div className={style.header}>
        <div>{quizName} Question Analysis</div>{" "}
        <div className={style.info}>
          <div>Created on: {formatDate(createdAtDate)}</div>
          <div>Impressions: {impressions}</div>
        </div>
      </div>
      {quiztype === "Quiz" &&
        questions.map((question, index) => (
          <div key={index}>
            <div className={style.question}>
              Q {index + 1}. {question.text}
            </div>
            <div className={style.analysis}>
              <div className={style.attemptsq}>
                <div>{attemptData[index]?.questionAttempts || 0}</div>
                <div>people Attempted the question</div>
              </div>
              <div className={style.attemptsq}>
                <div>{attemptData[index]?.correctCountQuestion || 0}</div>
                <div>people Answered Correctly</div>
              </div>
              <div className={style.attemptsq}>
                <div>
                  {(attemptData[index]?.questionAttempts || 0) -
                    (attemptData[index]?.correctCountQuestion || 0)}
                </div>
                <div>people Answered Incorrectly</div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      {quiztype === "Poll" &&
        questions.map((question, index) => (
          <div key={index}>
            <div className={style.question}>
              Q{index + 1}. {question.text}
            </div>
            <div className={style.analysis}>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className={style.attempts}>
                  <div>
                    {attemptData[index][`optionChosen${optIndex}`] || 0}
                  </div>
                  <div>option {optIndex + 1}</div>
                </div>
              ))}
            </div>
            <hr />
          </div>
        ))}
    </div>
  );
}

export default QuestionAnalysis;
