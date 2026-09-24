import axios from "axios";

const apiRequest = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default apiRequest;
