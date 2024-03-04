const express = require("express");

require("dotenv").config(); // to read .env file and make them available in process.env

console.log(process.env.PORT);
const PORT = process.env.PORT || 3300;
const app = express();

app.use(express.json());

app.get("/api/user", (req, res) => {
  res.json({
    status: "success",
    statusCode: 200,
    data: {
      name: "Bhuvi",
      age: 24,
    },
  });
});

app.post("/api/user", (req, res) => {
  console.log(req.body);
  res.json({
    data: req.body,
  });
});
app.use(function (req, res) {
  res.status(200).send("Hello world");
});

app.listen(3000, () => {
  console.log(`app is running on port ${PORT}`);
});
