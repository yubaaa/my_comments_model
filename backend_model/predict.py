import sys
import json
import numpy as np
import fasttext
from tensorflow import keras

model_path = "best_FRENCH_bilstm_model.keras"
model = keras.models.load_model(model_path)
ft = fasttext.load_model("cc.fr.300.bin")

def sentence_to_vector(sentence, model, max_len=100):
    words = sentence.split()
    vectors = [model.get_word_vector(word) for word in words]

    if len(vectors) > max_len:
        vectors = vectors[:max_len]
    elif len(vectors) < max_len:
        padding = [np.zeros(300)] * (max_len - len(vectors))
        vectors.extend(padding)

    return np.array(vectors)

def predict_sentiment(text):
    """Prédit le sentiment et retourne le résultat."""
    vectorized_text = np.expand_dims(sentence_to_vector(text, ft), axis=0)
    prediction = model.predict(vectorized_text)[0][0]

    sentiment = "Positif 😊" if prediction >= 0.5 else "Négatif 😠"
    confidence = prediction * 100 if prediction >= 0.5 else (1 - prediction) * 100

    return {
        "commentaire": text,
        "sentiment": sentiment,
        "confiance": f"{confidence:.2f}%"
    }

if __name__ == "__main__":
    comment = sys.argv[1]
    result = predict_sentiment(comment)
    print(json.dumps(result))
