import sys
import json
import numpy as np
import fasttext
from tensorflow import keras

sys.stdout.reconfigure(encoding='utf-8') 

model_path = "best_FRENCH_bilstm_model.keras"
model = keras.models.load_model(model_path)

model_path = "cc.fr.300.bin"
ft = fasttext.load_model(model_path)

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
    
    
    print(f"📝 Texte reçu: {text}")  # Vérifie que l'entrée est bien reçue
    
    vectorized_text = np.expand_dims(sentence_to_vector(text, ft), axis=0)
    print(f"🔍 Taille du vecteur: {vectorized_text.shape}")  # Vérifie la forme du vecteur

    prediction = model.predict(vectorized_text)[0][0]
    print(f"📊 Prédiction brute: {prediction}")  # Vérifie la valeur de prédiction

    sentiment = "Positif " if prediction >= 0.5 else "Negatif "
    confidence = prediction * 100 if prediction >= 0.5 else (1 - prediction) * 100

    result = {
        "commentaire": text,
        "sentiment": sentiment,
        "confiance": f"{confidence:.2f}%"
    }


    return result


if __name__ == "__main__":
    comment = sys.argv[1]
    result = predict_sentiment(comment)
    print(json.dumps(result))  # 🟢 Assure-toi que seul ce JSON est imprimé à la fin
    sys.stdout.flush()  # 🔄 Force la sortie immédiate vers Node.js