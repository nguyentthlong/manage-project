import { axiosInstance } from "../utils/myaxios";

export const createTeacherAPI = async (teacher) => {
  // let data = JSON.stringify(post);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/teacher/",
    headers: {
      "Content-Type": "application/json",
    },
    data: teacher,
  };

  return handleResponse(config);
};

export const searchTeacherAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/teacher/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const countTeacherAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/teacher/statistic",
  };
    return handleResponse(config);
}

export const getTeacherByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/teacher/${id}`,
  };
  return handleResponse(config);
};

export const updateTeacherAPI = async (teacher) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/teacher/update",
    headers: {
      "Content-Type": "application/json",
    },
    data: teacher,
  };

  return handleResponse(config);
};

export const deleteTeacherAPI = async (id) => {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/teacher/delete/${id}`,
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
