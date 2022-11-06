import axios from "axios";

// setup default axios configuration, such as url to server
const axiosConf = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL ?? "http://localhost:8000"}`,
});

export default axiosConf;
