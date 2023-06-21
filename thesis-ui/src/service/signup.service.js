import axios from "axios";

export function SignUpAPI(signup) {
let data = JSON.stringify(signup);

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:8811/api/auth/signup',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

}