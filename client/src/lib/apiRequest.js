import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://100-acre-8izx.vercel.app/",
  withCredentials: true,
});

export default apiRequest;