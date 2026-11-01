
const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  'https://placement-analyzer-api-drmt.onrender.com'
).replace(/\/+$/, '');

export default API_URL;
