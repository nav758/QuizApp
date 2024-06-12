import React, { useState } from "react";
import style from "./Create.module.css";

function Create({ onClose, setQuestions }) {
  const [quizType, setQuizType] = useState("");
  const [quizName, setQuizName] = useState("");

  const handleQuizTypeChange = (event) => {
    setQuizType(event.target.value);
  };

  const handleContinue = () => {
    if(quizName === ""||quizType === ""){
      alert("Please enter quiz name and quiz type");
    }
    else{
    setQuestions(quizType, quizName);
    }
  };

  return (
    <div className={style.overlay}>
      <div className={style.container}>
        <input
          type="text"
          placeholder="Quiz name"
          name="quizName"
          value={quizName}
          onChange={(event) => setQuizName(event.target.value)}
          className={style.input}
        />
        <div className={style.type}>
          <div>Quiz Type</div>
          <label className={style.customRadio}>
            <input
              type="radio"
              name="quizType"
              value="Quiz"
              checked={quizType === "Quiz"}
              onChange={handleQuizTypeChange}
            />
            <span className={style.customRadioLabel}>Q&A</span>
          </label>
          <label className={style.customRadio}>
            <input
              type="radio"
              name="quizType"
              value="Poll"
              checked={quizType === "Poll"}
              onChange={handleQuizTypeChange}
            />
            <span className={style.customRadioLabel}>Poll Type</span>
          </label>
        </div>
        <div className={style.button}>
          <div className={style.cancel} onClick={onClose}>
            Cancel
          </div>
          <div className={style.continue} onClick={handleContinue}>
            Continue
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
