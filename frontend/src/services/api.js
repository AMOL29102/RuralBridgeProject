import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const setToken = (token) => {
    if(token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
}

// Initialize token from localStorage on load
const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
if (userInfo) {
  const { token } = JSON.parse(userInfo);
  if (token) {
    setToken(token);
  }
}

export default API;