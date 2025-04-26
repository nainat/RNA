from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for React frontend (adjust origin as needed)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# Load the saved model, scaler, and label encoder
try:
    with open("rf_model.pkl", "rb") as file:
        model = pickle.load(file)
    with open("scaler.pkl", "rb") as file:
        scaler = pickle.load(file)
    with open("label_encoder.pkl", "rb") as file:
        label_encoder = pickle.load(file)
except FileNotFoundError as e:
    print(f"Error loading model files: {e}")
    exit(1)

# Expected number of features (based on training data: 20,531 genes)
EXPECTED_FEATURES = 20531


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Extract gene expression values (expecting a list of floats)
        if not data or 'gene_expression' not in data:
            return jsonify({
                'error': 'Missing gene_expression data in request'
            }), 400

        gene_expression = data['gene_expression']

        # Validate input
        if not isinstance(gene_expression, list):
            return jsonify({
                'error': 'gene_expression must be a list of numeric values'
            }), 400

        if len(gene_expression) != EXPECTED_FEATURES:
            return jsonify({
                'error': f'Expected {EXPECTED_FEATURES} features, got {len(gene_expression)}'
            }), 400

        # Convert to numpy array and reshape for a single sample
        X = np.array(gene_expression, dtype=float).reshape(1, -1)

        # Check for invalid values (e.g., NaN, inf)
        if np.any(np.isnan(X)) or np.any(np.isinf(X)):
            return jsonify({
                'error': 'Input contains invalid values (NaN or infinity)'
            }), 400

        # Scale the features
        X_scaled = scaler.transform(X)

        # Make prediction
        y_pred_encoded = model.predict(X_scaled)

        # Decode the prediction to cancer type
        y_pred = label_encoder.inverse_transform(y_pred_encoded)[0]

        # Return the prediction
        return jsonify({
            'sample_id': data.get('sample_id', 'unknown'),
            'prediction': y_pred,
            'status': 'success'
        }), 200

    except ValueError as e:
        return jsonify({
            'error': f'Invalid input data: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Welcome to the Cancer Prediction API',
        'endpoint': '/predict',
        'method': 'POST',
        'expected_input': {
            'sample_id': 'string (optional)',
            'gene_expression': f'list of {EXPECTED_FEATURES} float values'
        }
    }), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)