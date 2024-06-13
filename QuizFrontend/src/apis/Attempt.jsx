import axios from "axios";

const backendUrl = `https://quiz-backend-ecij.vercel.app/api/v1`;

export const submitQuiz = async (data) => {
    
    try {
        const reqUrl = `${backendUrl}/attempt/submit`;
       
        const response = await axios.put(reqUrl, data);
        return response.data;
    } catch (error) {
        console.log(error);
       
    }
}  

export const getAttempt = async (quizId) => {
    try {
        const reqUrl = `${backendUrl}/attempt/${quizId}`;
        const response = await axios.get(reqUrl);
        return response.data;
    } catch (error) {
        console.log(error);
       
    }
}
