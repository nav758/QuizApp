import React, { useState, useEffect, useRef } from "react";
import style from "./ShowQuestion.module.css";
import { getQuizbyId, incrementImpressions } from "../../apis/quiz";
import { useNavigate } from "react-router-dom";
import { submitQuiz } from "../../apis/Attempt";
import { IoIosClose } from "react-icons/io";

function ShowQuestion({ quizId }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [show, setShow] = useState(true);
  const [quizType, setQuizType] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showtimer, setShowtimer] = useState(true);
  const navigate = useNavigate();
  const isSubmitting = useRef(false); // Prevent double submission
  const hasMovedToNext = useRef(false); // Prevent multiple calls to handleNext

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching quiz with ID:", quizId);
        const response = await getQuizbyId(quizId);
        console.log("API Response:", response);
        if (
          response &&
          response.quiz &&
          response.quiz.questions &&
          response.quiz.questions.length > 0
        ) {
          setQuestionsData(response.quiz.questions);
          setQuizType(response.quiz.quizType);
          console.log(
            "Questions fetched successfully:",
            response.quiz.questions
          );
          await incrementImpressions(quizId);
          setTimeLeft(response.quiz.questions[0].timer === "OFF" ? null : parseInt(response.quiz.questions[0].timer));        
        } else {
          console.error("No questions found for the quiz");
          setError("No questions found for this quiz.");
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setError("Failed to fetch questions. Please try again later.");
      }
    };
    fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null) { 
      setShowtimer(false);
    }
    if (timeLeft !== null && timeLeft > 0) {
      setShowtimer(true);
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (questionsData.length > 0) {
      const timer = questionsData[currentQuestion].timer;
      setTimeLeft(timer !== "OFF" ? parseInt(timer) : null);
    }
  }, [currentQuestion, questionsData]);

  const handleNext = () => {
    if (hasMovedToNext.current) return; // Prevent multiple calls
    hasMovedToNext.current = true;

    // Record the attempt before moving to the next question
    if (selectedOption !== null) {
      const isCorrect = questionsData[currentQuestion].options[selectedOption].isCorrect;
      setAttempts((prevAttempts) => [
        ...prevAttempts,
        {
          questionId: questionsData[currentQuestion]._id,
          selectedOption,
          isCorrect,
        },
      ]);
      if (isCorrect) {
        setCorrectCount((prevCount) => prevCount + 1);
      }
    }

    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setSelectedOption(null);
      hasMovedToNext.current = false; // Reset for the next question
    } else {
      handleSubmit();
    }
  };

  const handleOptionClick = (index) => {
    if (timeLeft === null) {
       setSelectedOption(index);
       console.log("Selected option:", index);
    }
    if (timeLeft > 0) {
      setSelectedOption(index);
      console.log("Selected option:", index);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return; // Prevent double submission
    isSubmitting.current = true; // Mark as submitting

    const submission = {
      quizId: quizId,
      attempts: [
        ...attempts,
        {
          questionId: questionsData[currentQuestion]._id,
          selectedOption,
          isCorrect: questionsData[currentQuestion].options[selectedOption]?.isCorrect || false,
        },
      ],
      correctCount: correctCount + (questionsData[currentQuestion].options[selectedOption]?.isCorrect ? 1 : 0),
      totalAttempts: attempts.length + 1,
    };

    console.log("Submitting quiz:", submission);

    //Submit the data to your backend
    try {
      const response = await submitQuiz(submission); // Define submitQuiz to send data to the backend
      console.log("Quiz submitted successfully:", response);
      setShow(false);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      setError("Failed to submit quiz. Please try again later.");
    }

     setShow(false);
  };
 

  const handleClose = () => {
    navigate("/dashboard");
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (questionsData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.overlay}>
      {show && (
        <div className={style.container}>
          <div className={style.heading}>
            <div className={style.questionNumber}>{`${currentQuestion + 1}/${
              questionsData.length
            }`}</div>
            {showtimer && (
              <div className={style.timer}>{`00:${
                timeLeft < 10 ? `0${timeLeft}` : timeLeft
              }s`}</div>
            )}
          </div>

          <div className={style.question}>
            {questionsData[currentQuestion].text}
          </div>

          <div className={style.options}>
            {questionsData[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`${style.option} ${
                  selectedOption === index ? style.selectedOption : ""
                }`}
                onClick={() => handleOptionClick(index)}
                style={{ pointerEvents: timeLeft === 0 ? "none" : "auto" }}
              >
                {option.type === "text" && option.content}
                {option.type === "image" && (
                  <img src={option.imageUrl} alt="Option" />
                )}
                {option.type === "textImage" && (
                  <div className={style.textImage}>
                    <div>{option.content}</div>
                    <div className={style.image}>
                    <img src={option.imageUrl} alt="Option" />
                  </div></div>
                )}
              </div>
            ))}
          </div>

          {currentQuestion < questionsData.length - 1 && (
            <div className={style.next} onClick={handleNext}>
              Next
            </div>
          )}
          {currentQuestion === questionsData.length - 1 && (
            <div className={style.submit} onClick={handleNext}>
              Submit
            </div>
          )}
        </div>
      )}
      {!show && quizType === "Quiz" && (
        <div className={style.containerCompleted}>
          <div className={style.headingCompleted}>
            <div>Congrats Quiz is completed</div>{" "}
            <div className={style.winImg}>
              <img
                src="https://figma.com/file/RTn8FOXfJiRM5ujgn6LYOA/image/f47f6d98a013b07f931834dfba3cd6ddc9130436"
                alt="win"
              />
            </div>
            <div>
              Your Score is <span className={style.score}> 0{correctCount}/0{questionsData.length}
           </span> </div>
          </div>
          <div className={style.close}>
            <div onClick={handleClose}> <IoIosClose /> </div>
          </div>
        </div>
      )}
      {!show && quizType === "Poll" && (
        <div className={style.containerCompleted}>
          <div className={style.headingCompleted}>
            <div>Thank you</div>
            <div>for participating in</div>
            <div>the poll</div>
          </div>
          <div className={style.close}>
            <div onClick={handleClose}> <IoIosClose /> </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowQuestion;
