import os
import numpy as np
import librosa
import pymongo
import tensorflow as tf
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS  # For handling Cross-Origin Resource Sharing (CORS)
from scipy.ndimage import zoom
from pymongo import MongoClient  # For MongoDB integration
from dotenv import load_dotenv
from flask_pymongo import PyMongo

load_dotenv() 

# Read allowed origins from env
allowed_origins = os.getenv("ALLOWED_ORIGINS", "")
cors_origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": cors_origins}})  # Allow React frontend to communicate

# Load the trained model
MODEL_PATH = './Trained_model.h5'
model = tf.keras.models.load_model(MODEL_PATH)

# Genre labels - map model output to actual genre names
genre_labels = ['blues', 'classical','country','disco','hiphop','jazz','metal','pop','reggae','rock' ]

PORT = os.getenv("PORT")
# MongoDB setup
MONGO_URI = os.getenv("MONGO_LOCAL_URI")
# Configure Flask-PyMongo
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

client = MongoClient(MONGO_URI)
db = client["MusicApp"]  # Replace with your database name
collection = db["musics"]  # Replace with your collection name

# Function for resizing the Mel spectrogram
def resize(image, target_shape):
    return zoom(image, (target_shape[0] / image.shape[0], target_shape[1] / image.shape[1], 1))

# Load and preprocess audio data
def load_and_preprocess_data(file_stream, target_shape=(150, 150)):
    data = []
    audio_data, sample_rate = librosa.load(file_stream, sr=None)
    chunk_duration = 4  # seconds
    overlap_duration = 2  # seconds
    chunk_samples = chunk_duration * sample_rate
    overlap_samples = overlap_duration * sample_rate
    num_chunks = int(np.ceil((len(audio_data) - chunk_samples) / (chunk_samples - overlap_samples))) + 1

    for i in range(num_chunks):
        start = i * (chunk_samples - overlap_samples)
        end = start + chunk_samples
        chunk = audio_data[start:end]
        mel_spectrogram = librosa.feature.melspectrogram(y=chunk, sr=sample_rate)
        mel_spectrogram = resize(np.expand_dims(mel_spectrogram, axis=-1), target_shape)
        data.append(mel_spectrogram)

    return np.array(data)

# Model prediction
def model_prediction(X_test):
    y_pred = model.predict(X_test)
    predicted_categories = np.argmax(y_pred, axis=1)
    unique_elements, counts = np.unique(predicted_categories, return_counts=True)
    max_count = np.max(counts)
    max_elements = unique_elements[counts == max_count]
    return max_elements[0]

# Flask route for genre prediction
@app.route('/predict', methods=['POST'])
def predict_genre():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_stream = BytesIO(file.read())
    try:
        X_test = load_and_preprocess_data(file_stream)
        predicted_genre_index = model_prediction(X_test)
        predicted_genre = genre_labels[int(predicted_genre_index)]
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"genre": predicted_genre})

# Flask route for saving music data to MongoDB
@app.route('/save-music', methods=['POST'])
def save_music():
    data = request.json

    # Validate required fields
    required_fields = ["title", "artist", "album", "genre"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    try:
        # Insert into MongoDB Atlas
        collection.insert_one(data)
        return jsonify({"message": "Music data saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to save data: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=int(PORT) if PORT else 7000)
