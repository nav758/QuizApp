import React from 'react';
import { useLocation } from 'react-router-dom';
import ShowQuestion from '../../components/ShowQuestion/ShowQuestion';
import style from './ShowQuiz.module.css'; // Import the CSS module

function ShowQuiz() {
  const location = useLocation();
  const { quizId } = location.state;
   console.log(quizId);
  return (
    <div className={style.overlay}>
      <div className={style.container}>
        <ShowQuestion quizId={quizId} />
      </div>
    </div>
  );
}

export default ShowQuiz;
