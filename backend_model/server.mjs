import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Le serveur fonctionne !");
});

app.post("/predict", (req, res) => {
  console.log("📩 Requête reçue :", req.body);

  const comment = req.body.comment;
  if (!comment) {
    return res.status(400).json({ error: "Commentaire manquant dans la requête" });
  }

  console.log("⏳ Exécution de predict.py avec commentaire :", comment);
  const pythonProcess = spawn("python", ["predict.py", comment]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    console.log("🚀 Processus Python terminé avec code :", code);

    if (errorOutput) {
      console.error("⚠ Warnings ou erreurs détectés :", errorOutput.trim());
    }

    console.log("📤 Sortie brute du modèle :", output.trim());

    // 🛠 Extraire uniquement le JSON valide
    const jsonRegex = /{.*}/s; // Regex pour détecter un JSON dans la sortie
    const match = output.match(jsonRegex);

    if (!match) {
      console.error("❌ Aucun JSON valide trouvé !");
      return res.status(500).json({ error: "Réponse invalide du modèle" });
    }

    try {
      const result = JSON.parse(match[0]);
      console.log("✅ Résultat final envoyé au frontend :", result);
      return res.json(result);
    } catch (error) {
      console.error("❌ Erreur parsing JSON :", error);
      return res.status(500).json({ error: "Impossible de lire la réponse du modèle" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend lancé sur le port ${PORT}`));
