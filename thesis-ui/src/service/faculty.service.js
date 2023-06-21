
import { axiosInstance } from "../utils/myaxios";

export const createFacultyAPI = async (faculty) => {
  // let data = JSON.stringify(category);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/admin/faculty/",
    headers: {
      "Content-Type": "application/json",
    },
    data: faculty,
  };

  return handleResponse(config);
};

export const searchFacultyAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/admin/faculty/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const countFacultyAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/admin/faculty/statistic",
  };
    return handleResponse(config);
}

export const getFacultyByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/admin/faculty/${id}`,
  };
  return handleResponse(config);
};

export const  updateFacultyAPI = async (faculty) => {

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/admin/faculty/update",
    headers: {
      "Content-Type": "application/json",
    },
    data: faculty,
  };

  return handleResponse(config);
}

export const deleteFacultyAPI = async(id) => {

  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/admin/faculty/delete/${id}`,
  };

  return handleResponse(config);

}

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
