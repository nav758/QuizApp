const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const createUser = async (req, res) => {
  try {
    const {name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        errorMessage: "All fields are required",
      });
    }

    const isExistingUser = await User.findOne({ email });

    if (isExistingUser) {
      return res.status(409).json({
        errorMessage: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
      name,
      email,
      password: hashedPassword,
    });

    await userData.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        errorMessage: "Invalid credentials",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        errorMessage: "Invalid credentials",
      });
    } 
    const token = jwt.sign({ email: user.email, userId: user._id }, process.env.SCERET_CODE,{expiresIn: "30m"} );
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ errorMessage: "Something went wrong" });
  }
};

module.exports = { createUser, loginUser };
