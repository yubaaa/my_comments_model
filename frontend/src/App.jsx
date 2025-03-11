import { useState } from "react";

export default function App() {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError("Veuillez entrer un commentaire.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse du sentiment.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117] p-6">
      <div className="bg-[#161b22] p-8 rounded-3xl shadow-2xl w-full max-w-2xl text-white border border-gray-700">
        <h1 className="text-3xl font-semibold mb-6 text-center text-[#10a37f]">
          💬 Analyse de Sentiment
        </h1>

        <textarea
          className="w-full p-5 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10a37f] bg-[#0d1117] text-white placeholder-gray-400 resize-none shadow-lg text-lg h-36"
          rows="6"
          placeholder="Écrivez votre commentaire ici..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <button
          className="mt-4 w-full bg-[#10a37f] text-black py-3 rounded-2xl hover:bg-[#1ab38c] transition font-semibold shadow-lg disabled:opacity-50 text-lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ Analyse en cours..." : "🔍 Analyser"}
        </button>

        {result && (
          <div className="mt-6 p-6 bg-[#1c2128] rounded-2xl border border-[#10a37f] shadow-xl">
            <p className="text-xl font-semibold text-[#10a37f]">📝 Commentaire :</p>
            <p className="text-gray-300 italic">{result.commentaire}</p>

            <div className="mt-4">
              <p className="text-xl font-semibold text-[#10a37f]">🔹 Sentiment :</p>
              <p className="text-gray-300">{result.sentiment}</p>
            </div>

            <div className="mt-4">
              <p className="text-xl font-semibold text-[#10a37f]">🔹 Confiance :</p>
              <p className="text-gray-300">{result.confiance}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
