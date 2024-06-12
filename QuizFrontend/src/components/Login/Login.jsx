import React, { useState } from "react";
import style from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../apis/auth";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("");
  const navigate = useNavigate();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (!email) {
      setEmailPlaceholder("Field is empty");
    }
    if (!password) {
      setPasswordPlaceholder("Field is empty");
    }

    const result = await loginUser({ email, password });
    if (result) {
     
      navigate("/dashboard");
    }
    
  };

  return (
    <div className={style.container}>
      <div className={style.labelemail}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder={emailPlaceholder}
          onClick={() => setEmailPlaceholder("")}
          className="input"
        />
      </div>
      <div className={style.labelpassword}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder={passwordPlaceholder}
          onClick={() => setPasswordPlaceholder("")}
          className="input"
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
