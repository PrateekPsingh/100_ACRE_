import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://one00-acre-1.onrender.com/",
  withCredentials: true,
});

export default apiRequest;
