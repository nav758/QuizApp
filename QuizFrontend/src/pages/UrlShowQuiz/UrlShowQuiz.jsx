import React from 'react';
import { useParams } from 'react-router-dom';
import ShowQuestion from '../../components/ShowQuestion/ShowQuestion';
import style from './UrlShowQuiz.module.css';

function UrlShowQuiz() {
  const { quizId } = useParams(); 
  console.log(quizId);

  return (
    <div className={style.overlay}>
      <div className={style.container}>
        <ShowQuestion quizId={quizId} />
      </div>
    </div>
  );
}

export default UrlShowQuiz;
