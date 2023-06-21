import { axiosBlog } from "../utils/axios";

export const loginAPI = async (data) => {
    var config = {
        method: 'post',
        url: '/api/user/signin',
        data
    };

    return handleRequest(config)
}

export const meAPI = async (token) => {
  var config = {
      method: 'get',
      url: '/api/me',
      headers: {
        "Authorization": `Bearer ${token}`
      },
  };

  return handleRequest(config)
}

const handleRequest = async (config) => {
  try {
    const resp = await axiosBlog(config);
    console.log(resp);
    console.log("resp data auth"+JSON.stringify(resp.data.data));
    // doan nay phai tra ve object voi 2 key la code vs result moi dung chu
    // console.log( {code: resp.result.code, result: resp.result.data})
    return {code: resp.data.code, result: resp.data.data};
    
  } catch (error) {
    console.log(error);
    if (error.response)
      return (error.response.data)

    return ({ code: "408", message: error.message })
  }
}
