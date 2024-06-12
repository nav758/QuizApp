import React, { useContext } from 'react';
import style from './Share.module.css';
import { IoIosClose } from 'react-icons/io';
import { UserContext } from '../../../utils/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Share({ onClose }) {
  const { quizId } = useContext(UserContext);
  const { setquizId } = useContext(UserContext);
  const handleShareClick = () => {
    if (quizId) {
      const quizLink = `${window.location.origin}/quiz/${quizId}`;
      navigator.clipboard.writeText(quizLink)
        .then(() => {
          toast.success('Quiz link copied to clipboard!');
          
        })
        .catch((error) => {
          console.error('Failed to copy quiz link: ', error);
          toast.error('Failed to copy quiz link.');
        });
    setquizId(null);
 } 
  };

  return (
    <div className={style.overlay}>
      <div className={style.container}>
        <div>
          <IoIosClose className={style.close} onClick={onClose} />
        </div>
        <h1>Congrats your Quiz is</h1>
        <h1>Published!</h1>
        <div className={style.link}>{`${window.location.origin}/quiz/${quizId}`}</div>
        <button className={style.button} onClick={handleShareClick}>Share</button>
      </div>
    </div>
  );
}

export default Share;
