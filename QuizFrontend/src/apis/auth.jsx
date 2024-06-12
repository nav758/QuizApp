import axios from "axios";

const backendUrl = `http://localhost:4000/api/v1`;

export const registerUser = async ({ name, email, password, }) => {
  try {
    const reqUrl = `${backendUrl}/auth/signup`;
    console.log("Request URL:", reqUrl);
    console.log("Request Data:", { name, email, password });
    const response = await axios.post(reqUrl, {
      name,
      email,
      password   
    });
    console.log("Response Data:", response.data);
  } catch (error) {
    console.log("Error:", error);
    alert("Something went wrong!");
  }
};


export const loginUser = async ({ email, password }) => {
  try {
    const reqUrl = `${backendUrl}/auth/login`;
    const response = await axios.post(reqUrl, { email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    console.log("Response Data:", response.data);
    return response.data;
    
  } catch (error) {
    console.log(error);
    alert("Something went wrong!");
  }
};

