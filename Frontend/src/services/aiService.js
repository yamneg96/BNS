import API from './axios.js';

export const getAIPrediction = async (complaint) => {
  try {
    const res = await API.post('/ai/predict', { chiefComplaint: complaint });
    return res.data; // Returns { diagnosis, riskLevel }
  } catch (err) {
    console.error("AI Service Error:", err);
    throw err;
  }
};