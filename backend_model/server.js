const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/predict", (req, res) => {
  const comment = req.body.comment;

  const pythonProcess = spawn("python", ["predict.py", comment]);

  pythonProcess.stdout.on("data", (data) => {
    try {
      const result = JSON.parse(data.toString());
      res.json(result);
    } catch (error) {
      console.error("Error parsing response:", error);
      res.status(500).json({ error: "Invalid response from model" });
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Model error: ${data}`);
    res.status(500).json({ error: "Model failed to process" });
  });
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
