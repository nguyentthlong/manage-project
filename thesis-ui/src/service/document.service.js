import { axiosInstance } from "../utils/myaxios";
import axios from 'axios'
import fileDownload from 'js-file-download'

export const createDocumentAPI = async (document) => {
  // let data = JSON.stringify(post);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/document/",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: document,
  };

  return handleResponse(config);
};

export const countDocumentAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/document/statistic",
  };
    return handleResponse(config);
}

export const searchDocumentAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/document/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const getDocumentByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/document/${id}`,
  };
  return handleResponse(config);
};

export const updateDocumentAPI = async (document) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/document/update",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: document,
  };

  return handleResponse(config);
};



export const deleteDocumentAPI = async (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/document/delete/${id}`,
  };

  return handleResponse(config);
};

export const downloadDocumentFileAPI = async (filename) => {
  let url = `http://localhost:8811/api/document/download/${filename}`;

  axios.get(url, {
    responseType: 'blob',
  })
  .then((res) => {
    fileDownload(res.data, filename)
  })
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
