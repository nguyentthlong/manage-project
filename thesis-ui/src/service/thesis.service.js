import { axiosInstance } from "../utils/myaxios";

export const createThesisAPI = async (thesis) => {
// let data = JSON.stringify(comment);

let config = {
method: "post",
maxBodyLength: Infinity,
url: "http://localhost:8811/api/thesis/",
headers: {
"Content-Type": "application/json",
},
data: thesis,
};

return handleResponse(config);
};

export const searchThesisAPI = async (search) => {
let config = {
method: "post",
maxBodyLength: Infinity,
url: "http://localhost:8811/api/thesis/search",
headers: {
"Content-Type": "application/json",
},
data: search,
};

return handleResponse(config);
};

export const countThesisAPI = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:8811/api/thesis/statistic",
  };
    return handleResponse(config);
}

export const getThesisByIdAPI = async (id) => {
let config = {
method: "get",
maxBodyLength: Infinity,
url: `http://localhost:8811/api/thesis/${id}`,
};
return handleResponse(config);
};

export const updateThesisAPI = async (thesis) => {

let config = {
method: "put",
maxBodyLength: Infinity,
url: "http://localhost:8811/api/thesis/update",
headers: {
"Content-Type": "application/json",
},
data: thesis,
};

return handleResponse(config);
}

export const deleteThesisAPI = async(id) => {

let config = {
method: "delete",
maxBodyLength: Infinity,
url: `http://localhost:8811/api/thesis/delete/${id}`,
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