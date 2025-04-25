import React, { useState } from 'react';
import axios from 'axios';

// TypeScript interface for the response
interface PredictionResponse {
  prediction: number;
}

const Predict: React.FC = () => {
  // Assuming the model takes 10 features, initially set them as an array of empty strings
  const [features, setFeatures] = useState<number[]>(Array(10).fill(0));
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input change for each feature
  const handleInputChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = parseFloat(value); // Convert the string value to a number
    setFeatures(newFeatures);
  };

  // Handle form submission to make the API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    try {
      // Send POST request to Flask API
      const response = await axios.post<PredictionResponse>('http://127.0.0.1:5000/predict', {
        features: features
      });

      // Set the prediction value from the response
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error while making the prediction request:', error);
      setPrediction(null); // Reset prediction on error
    } finally {
      setLoading(false); // Set loading state to false after request completes
    }
  };

  return (
    <div>
      <h2>Cancer Detection Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {/* Create an input for each feature */}
          {features.map((feature, index) => (
            <div key={index}>
              <label>Feature {index + 1}: </label>
              <input
                type="number"
                value={feature}
                onChange={(e) => handleInputChange(index, e.target.value)}
                step="any" // Allow decimal input
              />
            </div>
          ))}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {prediction !== null && (
        <div>
          <h3>Prediction Result:</h3>
          <p>{`Cancer Type: ${prediction}`}</p>
        </div>
      )}
    </div>
  );
};

export default Predict;
