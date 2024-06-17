import React, { useContext, useState } from "react";
import style from "./Dashboard.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Dash from "../../components/Dashboard/Dash";
import Analysis from "../../components/Analysis/Analysis";
import Create from "../../components/Create/Create";
import Questions from "../../components/Questions/Questions";
import Polls from "../../components/Polls/Polls";
import Share from "../../components/Share/Share";
import QuestionAnalysis from "../../components/QuestionAnalysis/QuestionAnalysis";
import { createQuiz } from "../../apis/quiz";
import { UserContext } from "../../../utils/UserContext";
import { IoReorderThreeOutline } from "react-icons/io5";
function Dashboard() {
  const [dash, setDash] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [create, setCreate] = useState(false);
  const [questions, setQuestions] = useState(false);
  const [quizType, setQuizType] = useState("");
  const [polls, setPolls] = useState(false);
  const [share, setShare] = useState(false);
  const [quizName, setQuizName] = useState("");
  const { setQuizId } = useContext(UserContext);
  const [showQuestionAnalysis, setShowQuestionAnalysis] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const handleDash = () => {
    setDash(true);
    setAnalytics(false);
    if (window.innerWidth < 768)
    setShowSidebar(!showSidebar);
    setShowQuestionAnalysis(false);
  };

  const handleAnalytics = () => {
    setDash(false);
    setAnalytics(true);
    setShowQuestionAnalysis(false);
    if (window.innerWidth < 768) 
    setShowSidebar(!showSidebar);
  };

  const handleQuestionAnalysis = () => {
    setShowQuestionAnalysis(true);
    setDash(false);
    setAnalytics(false);
  };

  const handleCreate = () => {
    setCreate(true);
    if (window.innerWidth < 768)
    setShowSidebar(!showSidebar);
  };

  const handleSubmit = async (formData) => {
    const quizData = { ...formData, quizName, quizType };
    if (quizData) {
      try {
        const response = await createQuiz(quizData);
        console.log("Quiz Data:", response);
        const quizId = response.quiz._id;
        setQuizId(quizId);
        console.log("Quiz ID:", quizId);
      } catch (error) {
        console.error("Error creating quiz:", error);
      }
    }
    console.log("Form submitted:", quizData);

    setQuestions(false);
    setPolls(false);
    setShare(true);
  };

  const toggle = () => {
    setShowSidebar(!showSidebar);
  };
  const handleSetQuestions = (type, name) => {
    console.log("Selected Quiz Type:", type);
    console.log("Quiz Name:", name);
    setQuizName(name);
    setQuizType(type);
    if (type === "Quiz") {
      setQuestions(true);
      setPolls(false);
    } else {
      setPolls(true);
      setQuestions(false);
    }
    setCreate(false);
  };

  const handleResize = () => {
   if(window.innerWidth > 768) setShowSidebar(true);
   else setShowSidebar(false);
  };

  window.addEventListener("resize", handleResize);
  // if (window.innerWidth <= 768) setShowSidebar(true);
  console.log("showQuestionAnalysis:", showQuestionAnalysis);
  return (
    <div className={style.container}>
      <div className={style.threeOutline} onClick={toggle}>
        <IoReorderThreeOutline />
      </div>
      {showSidebar && (
        <div className={style.sidebar}>
          <Sidebar
            setDash={handleDash}
            setAnalytics={handleAnalytics}
            setCreate={handleCreate}
          />
        </div>
      )}
      <div className={style.dash}>
        {dash && <Dash />}
        {analytics && (
          <Analysis setQuestionsAnalysis={handleQuestionAnalysis} />
        )}
        {showQuestionAnalysis && <QuestionAnalysis />}
      </div>

      <div className={create && style.create}>
        {create && (
          <Create
            onClose={() => setCreate(false)}
            setQuestions={handleSetQuestions}
          />
        )}
      </div>
      <div className={questions && style.question}>
        {questions && (
          <Questions
            onClose={() => setQuestions(false)}
            onCreateQuiz={handleSubmit}
          />
        )}
        {polls && (
          <Polls onClose={() => setPolls(false)} onCreateQuiz={handleSubmit} />
        )}
        {share && <Share onClose={() => setShare(false)} />}
      </div>
    </div>
  );
}

export default Dashboard;
