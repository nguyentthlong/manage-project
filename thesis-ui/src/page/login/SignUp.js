import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Checkbox,
  FormLabel,
  Radio,
  Chip,
  Autocomplete,
} from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { SignUpUserAPI, createUserAPI } from "../../service/user.service";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getRoleIds, setRoleSearch } from "../../redux/roleSlice";

const Signup = () => {
  let navigate = useNavigate();
  const { showError } = useError();
  let dispatch = useDispatch();
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const marginTop = { marginTop: 5 };
  const [selectedFile, setSelectedFile] = useState();
  const {
    roles,
    recordsFiltered,
    search: searchRole,
    error,
    role,
    isLoading: isLoadingRole,
  } = useSelector((state) => state.role);

  function handleChange(event) {
    //console.log("file up ",event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }

  const handleFilterRole = (value) => {
    dispatch(setRoleSearch({ ...searchRole, value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getRoleIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchRole]);

  const NewItemSchema = Yup.object().shape({
    username: Yup.string().required("Required, please enter."),
    fullname: Yup.string().required("Required, please enter."),
    password: Yup.string().required("Required, please enter."),
    email: Yup.string().required("Required, please enter."),
    phoneNumber: Yup.string().required("Required, please enter."),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(NewItemSchema),
  });

  const createUser = async (user) => {
    //console.log("user add new; ",JSON.stringify(user.birthdate));
    let formData = new FormData();
    formData.append("username", `${user.username}`);
    formData.append("password", `${user.password}`);
    formData.append("fullname", `${user.fullname}`);
    formData.append("email", `${user.email}`);
    formData.append("address", `${user.address}`);
    formData.append("birthdate", `${user.birthdate}`);
    formData.append("gender", `${user.gender}`);
    formData.append("phoneNumber", `${user.phoneNumber}`);
    formData.append("file", selectedFile);
    let { code } = await SignUpUserAPI(formData);
    if (code === 200) {
      navigate("/login");
    } else showError(code);
  };

  return (
    <Grid>
      <Paper
        elevation={20}
        style={{ padding: "40px 30px", width: 300, margin: " auto" }}
      >
        <Grid align="center">
          <Avatar style={avatarStyle}></Avatar>
          <h2>Đăng ký</h2>
          <Typography variant="caption" gutterBottom>
            Hãy điền đầy đủ thông tin dưới đây để tạo tài khoản
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit(createUser)}>
          <TextField
            name="username"
            {...register("username")}
            margin="normal"
            fullWidth
            placeholder="Tên đăng nhập"
          />
          <TextField
            name="password"
            type={"password"}
            {...register("password")}
            margin="normal"
            fullWidth
            placeholder="Mật khẩu"
          />
          <TextField
            name="fullname"
            {...register("fullname")}
            margin="normal"
            fullWidth
            placeholder="Họ và tên"
          />
          <TextField
            label="Ngày sinh (dd//MM/yyyy)"
            variant="outlined"
            size="medium"
            type="text"
            id="birthdate"
            name="birthdate"
            fullWidth
            max="2030/12/31"
            {...register("birthdate")}
          />
          <TextField
            {...register("address")}
            margin="normal"
            fullWidth
            placeholder="Địa chỉ"
          />
          <TextField
            {...register("phoneNumber")}
            margin="normal"
            fullWidth
            placeholder="Số điện thoại"
          />
          <TextField
            name="email"
            {...register("email")}
            margin="normal"
            fullWidth
            placeholder="Email"
          />

          <FormControl component="fieldset" style={marginTop}>
            <FormLabel component="legend">Giới tính</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              style={{ display: "initial" }}
            >
              <FormControlLabel
                value="Nam"
                {...register("gender")}
                control={<Radio />}
                label="Nam"
              />
              <FormControlLabel
                value="Nữ"
                {...register("gender")}
                control={<Radio />}
                label="Nữ"
              />
              <FormControlLabel
                value="Khác"
                {...register("gender")}
                control={<Radio />}
                label="Khác"
              />
            </RadioGroup>
          </FormControl>

          <Button variant="contained" component="label">
            <input
              accept="image/*"
              multiple
              type="file"
              name="file"
              onChange={handleChange}
            />
          </Button>
          <FormControlLabel
            control={<Checkbox name="checkedA" />}
            label="I accept the terms and conditions."
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              marginTop: 3,
              borderRadius: 2,
              width: 305,
              backgroundColor: "#DE3C00",
              color: "white",
            }}
          >
            Đăng ký
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default Signup;
