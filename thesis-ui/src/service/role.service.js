
import { axiosInstance } from "../utils/myaxios";

export const createRoleAPI = async (role) => {
  // let data = JSON.stringify(category);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/admin/role/",
    headers: {
      "Content-Type": "application/json",
    },
    data: role,
  };

  return handleResponse(config);
};

export const searchRoleAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/admin/role/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const getRoleByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/admin/role/${id}`,
  };
  return handleResponse(config);
};

export const  updateFacultyAPI = async (role) => {

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/admin/role/update",
    headers: {
      "Content-Type": "application/json",
    },
    data: role,
  };

  return handleResponse(config);
}

export const deleteRoleAPI = async(id) => {

  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/admin/role/delete/${id}`,
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
