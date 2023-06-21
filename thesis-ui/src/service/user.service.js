import { axiosInstance } from "../utils/myaxios";
import axios from "axios";
import fileDownload from "js-file-download";

export const createUserAPI = async (user) => {
  // let data = JSON.stringify(user);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/user/add",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: user,
  };

  return handleResponse(config);
};

export const SignUpUserAPI = async (user) => {
  // let data = JSON.stringify(user);
  console.log(user);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/user/signup",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: user,
  };

  return handleResponse(config);
};

export const searchUserAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/user/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const countUserAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/user/statistic",
  };
  return handleResponse(config);
};

export const getUserByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/user/${id}`,
  };
  return handleResponse(config);
};

export const updateUserAPI = async (user) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/user/update",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: user,
  };

  return handleResponse(config);
};

export const downloadDocumentUserAPI = async (filename) => {
  let url = `http://localhost:8811/api/user/download/${filename}`;

  axios
    .get(url, {
      responseType: "blob",
    })
    .then((res) => {
      fileDownload(res.data, filename);
    });
};

export const deleteUserAPI = async (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/user/delete/${id}`,
  };

  return handleResponse(config);
};

const handleResponse = async (config) => {
  try {
    //console.log("config ",JSON.stringify(config));
    let response = await axiosInstance(config);

    let result = response.data;
    return { code: 200, result };
  } catch (error) {
    console.log(error);

    if (error.response) {
      return { code: error.response.status };
    } else if (error.request) {
      return { code: 408 };
    } else {
      return { code: 500 };
    }
  }
};
