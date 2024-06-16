import axios from "axios";

import { Navigate } from "react-router-dom";
const backendUrl = `https://quiz-backend-ecij.vercel.app/api/v1`;
const navigate = Navigate;

export const createQuiz = async (data) => {
  try {
    const reqUrl = `${backendUrl}/quiz/create`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(reqUrl, data);
    return response.data;
  } catch (error) {
    if (error.response.data.errorMessage === "expired") {
      localStorage.removeItem("token");
      window.location.reload();
      navigate("/home");
      alert("Session expired. Please login again.");
    }
    console.log(error);
    // alert("Something went wrong!");
  }
};

export const getAllQuiz = async () => {
  try {
    const reqUrl = `${backendUrl}/quiz/`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.log(error);
    // alert("Something went wrong!");
  }
};

export const getQuizbyId = async (quizId) => {
  try {
    const reqUrl = `${backendUrl}/quiz/${quizId}`;
    const response = await axios.get(reqUrl);

    return response.data;
  } catch (error) {
    console.log(error);
    // alert("Something went wrong!");
  }
};

export const getQuizbyUserId = async (userId) => {
  try {
    const reqUrl = `${backendUrl}/quiz/user/${userId}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(reqUrl);

    return response.data;
  } catch (error) {
    console.log(error.response.data.errorMessage === "expired");
    if (error.response.data.errorMessage === "expired") {
      localStorage.removeItem("token");

      
      window.location.reload();
      navigate("/home");alert("Session expired. Please login again.");
    }
    console.log(error);
    // alert("Something went wrong!");
  }
};

export const incrementImpressions = async (quizId) => {
  try {
    const reqUrl = `${backendUrl}/quiz/${quizId}/impressions`;
    const response = await axios.put(reqUrl);
    return response.data;
  } catch (error) {
    console.log(error);
    // alert("Something went wrong!");
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const reqUrl = `${backendUrl}/quiz/${quizId}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.delete(reqUrl);
    return response.data;
  } catch (error) {
    if (error.response.data.errorMessage === "expired") {
      localStorage.removeItem("token");
      
      window.location.reload();
      navigate("/home");alert("Session expired. Please login again.");
    }
    console.log(error);
    // alert("Something went wrong!");
  }
};

export const updateQuiz = async (quizId, data) => {
  try {
    const reqUrl = `${backendUrl}/quiz/${quizId}`;
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(reqUrl, data);
    return response.data;
  } catch (error) {
    if (error.response.data.errorMessage === "expired") {
      localStorage.removeItem("token");
      
      window.location.reload();
      navigate("/home");alert("Session expired. Please login again.");
    }
    console.log(error);
    // alert("Something went wrong!");
  }
};
