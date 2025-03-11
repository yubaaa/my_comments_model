import { useState } from "react";

export default function App() {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Enter a Comment
        </h1>
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black"
          rows="4"
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {result && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <p className="text-lg font-semibold">📝 Commentaire :</p>
            <p className="text-gray-800">{result.commentaire}</p>
            <p className="mt-2 text-lg font-semibold">🔹 Sentiment :</p>
            <p className="text-gray-800">{result.sentiment}</p>
            <p className="mt-2 text-lg font-semibold">🔹 Confiance :</p>
            <p className="text-gray-800">{result.confiance}</p>
          </div>
        )}
      </div>
    </div>
  );
}
