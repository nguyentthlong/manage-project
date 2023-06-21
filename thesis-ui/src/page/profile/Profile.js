import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

let user = JSON.parse(localStorage.getItem("user"));

export default function Profile() {
  return (
    <Box sx={{ padding: '10px' , marginLeft: -20}}>
      <Typography variant="h4" style={{textAlign: 'center',}}>
        Hồ sơ của bạn 
      </Typography>
      {user.gender === 'Nam' ? (
        <MaleProfileComponent />
      ) : (
        <FemaleProfileComponent />
      )}
    </Box>
  );
};

const FemaleProfileComponent = () => {
  return (<Box
    sx={{
      display: "flex",
      justifyContent: "left",
      alignItems: "left",
      flexDirection: "column",
      margin: "auto",
      marginTop: 2,
      marginBottom: 1,
      padding: 3,
      borderRadius: 5,
      boxShadow: "5px 5px 10px #ccc",
      ":hover": { boxShadow: "10px 10px 20px #ccc" },
      backgroundColor: '#FFD3E0'
    }}
    maxWidth={400}
  >
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
        <Avatar
            alt=""
            style={{ height: 70, width: 70 }}
            src={`http://localhost:8811/api/user/download/${user.avatar}`}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" align="center">
          {user.fullname}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Email: {user.email}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Số điện thoại: {user.phoneNumber}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Địa chỉ: {user.address}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Ngày sinh: {user.birthdate}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Giới tính: {user.gender}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Vai trò: {user.roles[0].name}
        </Typography>
      </Grid>
    </Grid>
    </Box>
  );
  }


const MaleProfileComponent = () => {
    return (<Box
      sx={{
        display: "flex",
        justifyContent: "left",
        alignItems: "left",
        flexDirection: "column",
        margin: "auto",
        marginTop: 2,
        marginBottom: 1,
        padding: 3,
        borderRadius: 5,
        boxShadow: "5px 5px 10px #ccc",
        ":hover": { boxShadow: "10px 10px 20px #ccc" },
        backgroundColor: '#AEDFF2'
      }}
      maxWidth={400}
    >
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
          <Avatar
              alt=""
              style={{ height: 70, width: 70 }}
              src={`http://localhost:8811/api/user/download/${user.avatar}`}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            {user.fullname}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Email: {user.email}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Số điện thoại: {user.phoneNumber}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Địa chỉ: {user.address}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Ngày sinh: {user.birthdate}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Giới tính: {user.gender}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Vai trò: {user.roles[0].name}
          </Typography>
        </Grid>
      </Grid>
      </Box>
    );
    }