import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://one00-acre-1.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
