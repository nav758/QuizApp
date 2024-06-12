import React, { useState, useEffect, useContext } from "react";
import styles from "./Questions.module.css";
import { IoIosClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext } from "../../../utils/UserContext";
import { getQuizbyId } from "../../apis/quiz";

function Questions({ onClose, onCreateQuiz, setupdateQuiz }) {
  const { quizId } = useContext(UserContext);

  const [questions, setQuestions] = useState([
    {
      text: "",
      pollType: "text",
      options: [
        { type: "text", content: "", isCorrect: false },
        { type: "text", content: "", isCorrect: false },
      ],
      timer: "OFF",
    },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getQuizbyId(quizId);
        if (response && response.quiz.questions) {
          const fetchedQuestions = response.quiz.questions.map((question) => ({
            text: question.text,
            pollType: question.pollType,
            options: question.options.map((option) => ({
              ...option,
              isCorrect: option.correct,
            })),
            timer: question.timer || "OFF",
          }));
          setQuestions(fetchedQuestions);
        }
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
      }
    };
    fetchQuizData();
  }, [quizId]);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, key, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][key] = value;
    setQuestions(newQuestions);
  };

  const handlePollTypeChange = (index, type) => {
    const newQuestions = [...questions];
    newQuestions[index].pollType = type;
    newQuestions[index].options = [
      { type, content: "", isCorrect: false },
      { type, content: "", isCorrect: false },
    ];
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          text: "",
          pollType: "text",
          options: [
            { type: "text", content: "", isCorrect: false },
            { type: "text", content: "", isCorrect: false },
          ],
          timer: "OFF",
        },
      ]);
      setCurrentQuestion(questions.length);
    }
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length < 4) {
      newQuestions[qIndex].options.push({
        type: newQuestions[qIndex].pollType,
        content: "",
        isCorrect: false,
      });
      setQuestions(newQuestions);
    }
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.forEach((option, index) => {
      option.isCorrect = index === oIndex;
    });
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  const handleSubmit = () => {
    const isAnyFieldEmpty = questions.some(
      (question) =>
        question.text.trim() === "" ||
        question.options.some((option) => option.content.trim() === "")
    );

    if (isAnyFieldEmpty) {
      alert("Please fill all fields");
      return;
    }

    if (quizId) {
      const updateData = { questions };
      setupdateQuiz(updateData);
    } else {
      const formData = { questions };
      onCreateQuiz(formData);
    }
  };

  const handleTimerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].timer = value;
    setQuestions(newQuestions);
  };

  return (
    <div className={`${styles.popup} ${styles.show}`}>
      <div className={styles.container}>
        <div className={styles.questions}>
          {questions.map((question, index) => (
            <div
              className={`${styles.question} ${
                index === currentQuestion ? styles.active : ""
              }`}
              key={index}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
              {questions.length > 1 && index !== 0 && (
                <IoIosClose
                  className={styles.close}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveQuestion(index);
                  }}
                />
              )}
            </div>
          ))}
          {questions.length < 5 && (
            <>
              <div className={styles.question} onClick={handleAddQuestion}>
                <FaPlus />
              </div>
              <h6 className={styles.info1}>Add up to 5 questions</h6>
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.questionInputContainer}>
            <input
              type="text"
              placeholder="Enter your question"
              value={questions[currentQuestion]?.text}
              onChange={(e) =>
                handleQuestionChange(currentQuestion, e.target.value)
              }
              className={styles.questionInput}
            />
          </div>
          <div className={styles.pollTypeContainer}>
            <label>Poll Type:</label>
            <div className={styles.pollTypeOptions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="text"
                  checked={questions[currentQuestion]?.pollType === "text"}
                  onChange={() => handlePollTypeChange(currentQuestion, "text")}
                  className={styles.radioInput}
                />
                Text
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="image"
                  checked={questions[currentQuestion]?.pollType === "image"}
                  onChange={() =>
                    handlePollTypeChange(currentQuestion, "image")
                  }
                  className={styles.radioInput}
                />
                Image URL
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="textImage"
                  checked={questions[currentQuestion]?.pollType === "textImage"}
                  onChange={() =>
                    handlePollTypeChange(currentQuestion, "textImage")
                  }
                  className={styles.radioInput}
                />
                Text & Image URL
              </label>
            </div>
          </div>
          <div className={styles.optionsContain}>
            {questions[currentQuestion]?.pollType === "text" && (
              <div>
                {questions[currentQuestion]?.options.map((option, oIndex) => (
                  <div key={oIndex} className={styles.optionContainer}>
                    <input
                      type="radio"
                      name={`correctOption${currentQuestion}`}
                      checked={option.isCorrect}
                      onChange={() =>
                        handleCorrectOptionChange(currentQuestion, oIndex)
                      }
                      className={styles.correctRadio}
                    />
                    <input
                      type="text"
                      placeholder="Enter option content"
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(
                          currentQuestion,
                          oIndex,
                          "content",
                          e.target.value
                        )
                      }
                      className={`${styles.optionInput} ${
                        option.isCorrect ? styles.correctOption : ""
                      }`}
                    />
                    {questions[currentQuestion]?.options.length > 2 &&
                      oIndex >= 2 && (
                        <div
                          onClick={() =>
                            handleRemoveOption(currentQuestion, oIndex)
                          }
                          className={`${
                            questions[currentQuestion]?.pollType === "text"
                              ? styles.remove
                              : styles.removeOption
                          }`}
                        >
                          <RiDeleteBin6Line />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
            {questions[currentQuestion]?.pollType === "image" && (
              <div>
                {questions[currentQuestion]?.options.map((option, oIndex) => (
                  <div key={oIndex} className={styles.optionContainer}>
                    <input
                      type="radio"
                      name={`correctOption${currentQuestion}`}
                      checked={option.isCorrect}
                      onChange={() =>
                        handleCorrectOptionChange(currentQuestion, oIndex)
                      }
                      className={styles.correctRadio}
                    />
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(
                          currentQuestion,
                          oIndex,
                          "content",
                          e.target.value
                        )
                      }
                      className={`${styles.optionInput} ${
                        option.isCorrect ? styles.correctOption : ""
                      }`}
                    />
                    {questions[currentQuestion]?.options.length > 2 &&
                      oIndex >= 2 && (
                        <div
                          onClick={() =>
                            handleRemoveOption(currentQuestion, oIndex)
                          }
                          className={`${
                            questions[currentQuestion]?.pollType === "image"
                              ? styles.remove
                              : styles.removeOption
                          }`}
                        >
                          <RiDeleteBin6Line />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
            {questions[currentQuestion]?.pollType === "textImage" && (
              <div>
                {questions[currentQuestion]?.options.map((option, oIndex) => (
                  <div key={oIndex} className={styles.optionContainer}>
                    <input
                      type="radio"
                      name={`correctOption${currentQuestion}`}
                      checked={option.isCorrect}
                      onChange={() =>
                        handleCorrectOptionChange(currentQuestion, oIndex)
                      }
                      className={styles.correctRadio}
                    />
                    <input
                      type="text"
                      placeholder="Enter text content"
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(
                          currentQuestion,
                          oIndex,
                          "content",
                          e.target.value
                        )
                      }
                      className={`${styles.optionInput} ${
                        option.isCorrect ? styles.correctOption : ""
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      value={option.imageUrl || ""}
                      onChange={(e) =>
                        handleOptionChange(
                          currentQuestion,
                          oIndex,
                          "imageUrl",
                          e.target.value
                        )
                      }
                      className={`${styles.optionInputs} ${
                        option.isCorrect ? styles.correctOption : ""
                      }`}
                    />
                    {questions[currentQuestion]?.options.length > 2 &&
                      oIndex >= 2 && (
                        <div
                          onClick={() =>
                            handleRemoveOption(currentQuestion, oIndex)
                          }
                          className={styles.removeOption}
                        >
                          <RiDeleteBin6Line />
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.timerContainer}>
            <label>Timer:</label>
            <div className={styles.timerOptions}>
              <div
                className={`${styles.timerOption} ${
                  questions[currentQuestion]?.timer === "OFF"
                    ? styles.activeTimer
                    : ""
                }`}
                onClick={() => handleTimerChange(currentQuestion, "OFF")}
              >
                OFF
              </div>
              <div
                className={`${styles.timerOption} ${
                  questions[currentQuestion]?.timer === "05"
                    ? styles.activeTimer
                    : ""
                }`}
                onClick={() => handleTimerChange(currentQuestion, "05")}
              >
                5 sec
              </div>
              <div
                className={`${styles.timerOption} ${
                  questions[currentQuestion]?.timer === "10"
                    ? styles.activeTimer
                    : ""
                }`}
                onClick={() => handleTimerChange(currentQuestion, "10")}
              >
                10 sec
              </div>
            </div>
          </div>
          {questions[currentQuestion]?.options.length < 4 && (
            <button
              onClick={() => handleAddOption(currentQuestion)}
              className={styles.addOption}
            >
              Add Option
            </button>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.createQuizButton}>
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Questions;
