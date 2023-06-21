import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginAPI, meAPI } from "../../service/auth.service";
import { toast } from "react-toastify";

function Login() {
  let { login } = useAuth();
  
  let navigate = useNavigate();

  //ham hook
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  const onSubmit = async () => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("username", username);
    urlencoded.append("password", password);

    const { code, result } = await loginAPI(urlencoded);

    if (code === "200") {
      //goi api me de lay thong tin nguoi dung ve
      const { result: user } = await meAPI(result);
      login(result, user);
      
    } else {
      toast(`Error: ${code}`, {
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
        theme: "colored",
      });
    }
  };
  return (
    <div style={{height: 'auto', width:'auto', backgroundRepeat: 'no-repeat'
    , backgroundPosition: 'center', }}>
    {/* <div style={{backgroundImage: 'url("/NEU.jpg")', height: 'auto', width:'auto', backgroundRepeat: 'no-repeat'
    , backgroundPosition: 'center', }}> */}
      <form style={{padding: '50px 50px 50px 50px'}}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            margin: "auto",
            marginTop: 2,
            marginBottom: 1,
            padding: 3,
            borderRadius: 5,
            boxShadow: "5px 5px 10px #ccc",
            ":hover": { boxShadow: "10px 10px 20px #ccc" },
            backgroundColor: 'white'
          }}
          maxWidth={400}
        >
          <img src="https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/326754641_2022457434610974_7471045119980318203_n.png?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Yv_uzTwog2EAX9il5y4&_nc_ht=scontent.fhan4-3.fna&oh=00_AfBqzJvvhm5zNBTxqWp4lyiPXDCCNMclhRz_ZN-WJ1xaJQ&oe=6491DFC0" width={150} 
          alt="TLU-logo"
          style={{marginLeft: 8, marginBottom: 2}}
          ></img>
          <span variant="" fontWeight='' style={{color: '#183C69', fontWeight: 700}} padding={3} textAlign="center">
            TRƯỜNG ĐẠI HỌC THỦY LỢI
          </span>
          <Typography variant="bold" style={{position: 'center', fontWeight: 500}}>Cổng thông tin đào tạo</Typography>
          <div>
            ----------*----------
          </div>
          <TextField
            margin="normal"
            type={"email"}
            variant="outlined"
            placeholder="Tên đăng nhập"
            onChange={(e) => setUsername(e.target.value)}
          ></TextField>
          <TextField
            margin="normal"
            type={"password"}
            variant="outlined"
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <Link
            to="/dashboard/faculty/search"
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="contained"
              sx={{ marginTop: 3, borderRadius: 2, width: 205 , backgroundColor: '#183C69' ,color: 'white'}}
              type="button"
              onClick={() => onSubmit()}
            >
              Đăng nhập
            </Button>
          </Link>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <Button variant="contained" sx={{ marginTop: 3, borderRadius: 2, width: 205, backgroundColor: '#DE3C00', color: 'white' }}>
              Đăng ký
            </Button>
          </Link>
        </Box>
      </form>
    </div>
  );
}

export default Login;
