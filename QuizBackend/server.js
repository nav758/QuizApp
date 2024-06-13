const express = require("express");
const { default: mongoose } = require("mongoose");
const authRoute = require("./routes/user");
const QuizRoute = require("./routes/Quiz");
const AttemptRoute = require("./routes/Attempt");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());


app.use( cors({
    origin: ["https://quiz-app-chi-woad.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));

mongoose
    .connect(process.env.MONGO_URI || "mongodb+srv://rainaveen75:fHTUANJICDDicvkx@cluster0.y38cdvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(" Error ",err));


app.get("/api/health", (req, res) => {
    res.json({
      service: "Backend server",
      status: "active",
      time: new Date(),
    });
  }); 
 


  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/quiz", QuizRoute);
 app.use("/api/v1/attempt",  AttemptRoute);
  app.use("*", (req, res) => {
    res.status(404).json({
      errorMessage: "Page not found",
    });
  });

  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }); 
 
  const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running at port ${PORT}`);
});
