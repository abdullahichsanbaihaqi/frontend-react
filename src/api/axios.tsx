import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5117/api",
});

export default instance;