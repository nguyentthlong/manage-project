import { axiosInstance } from "../utils/myaxios";

export const createClassesAPI = async (classes) => {
  // let data = JSON.stringify(post);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/classes/",
    headers: {
      "Content-Type": "application/json",
    },
    data: classes,
  };

  return handleResponse(config);
};

export const searchClassesAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/classes/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const countClassesAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/classes/statistic",
  };
    return handleResponse(config);
}

export const getClassesByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/classes/${id}`,
  };
  return handleResponse(config);
};

export const updateClassesAPI = async (classes) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/classes/update",
    headers: {
      "Content-Type": "application/json",
    },
    data: classes,
  };

  return handleResponse(config);
};

export const deleteClassesAPI = async (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/classes/delete/${id}`,
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
