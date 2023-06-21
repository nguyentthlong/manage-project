import { axiosInstance } from "../utils/myaxios";

export const createStudentAPI = async (student) => {
  // let data = JSON.stringify(post);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/student/",
    headers: {
      "Content-Type": "application/json",
    },
    data: student,
  };

  return handleResponse(config);
};

export const searchStudentAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/student/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const countStudentAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/student/statistic",
  };
    return handleResponse(config);
}

export const getStudentByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/student/${id}`,
  };
  return handleResponse(config);
};

export const updateStudentAPI = async (student) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/student/update",
    headers: {
      "Content-Type": "application/json",
    },
    data: student,
  };

  return handleResponse(config);
};

export const deleteStudentAPI = async (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/student/delete/${id}`,
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
