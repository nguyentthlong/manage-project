
import { axiosInstance } from "../utils/myaxios";

export const createEvaluationAPI = async (evaluation) => {
  // let data = JSON.stringify(category);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/evaluation/",
    headers: {
      "Content-Type": "application/json",
    },
    data: evaluation,
  };

  return handleResponse(config);
};

export const searchEvaluationAPI = async (search) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/evaluation/search",
    headers: {
      "Content-Type": "application/json",
    },
    data: search,
  };

  return handleResponse(config);
};

export const getEvaluationByIdAPI = async (id) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/evaluation/${id}`,
  };
  return handleResponse(config);
};

export const countEvaluationAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/evaluation/statistic",
  };
    return handleResponse(config);
}

export const  updateEvaluationAPI = async (evaluation) => {

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/evaluation/update",
    headers: {
      "Content-Type": "application/json",
    },
    data: evaluation,
  };

  return handleResponse(config);
}

export const deleteEvaluationAPI = async(id) => {

  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `http://localhost:8811/api/evaluation/delete/${id}`,
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
