import axios from "axios";
let baseURL =  process.env.NODE_ENV == 'development' ? '/api/gulu/mgtv/' : 'http://' + window.location.host + '/gulu/mgtv/'


axios.defaults.timeout = 20000;
axios.defaults.baseURL = baseURL
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.log('服务器异常')
  }
);

export default axios;
