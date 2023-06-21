import { axiosInstance } from "../utils/myaxios";

export const createMajorAPI = async (major) => {
  // let data = JSON.stringify(post);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/major/",
    headers: {
      "Content-Type": "application/json",
    },
    data: major,
  };

  return handleResponse(config);
};

export const searchMajorAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/major/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const countMajorAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/major/statistic",
  };
    return handleResponse(config);
}

export const getMajorByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/major/${id}`,
  };
  return handleResponse(config);
};

export const updateMajorAPI = async (major) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/major/update",
    headers: {
      "Content-Type": "application/json",
    },
    data: major,
  };

  return handleResponse(config);
};

export const deleteMajorAPI = async (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/major/delete/${id}`,
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
