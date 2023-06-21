import axios from "axios";
import nProgress from "nprogress";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8811",
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(function (config) {
  let { headers } = config;

  let accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers = {
      ...headers,
      "Authorization": `Bearer ${accessToken}`
    };
  }
  nProgress.start();

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (resp) {
  nProgress.done();
  return resp;
}, function (error) {
  nProgress.done();
  // Do something with request error
  return Promise.reject(error);
});