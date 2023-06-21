import { yupResolver } from "@hookform/resolvers/yup";
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
  Stack,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createUserAPI, updateUserAPI } from "../../service/user.service";
import { React, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { getRoleIds, setRoleSearch } from "../../redux/roleSlice";

export default function EditUser() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const marginTop = { marginTop: 5 };

  const { showError } = useError();
  const [selectedFile, setSelectedFile] = useState();

  let { id } = useParams();
  const { users } = useSelector((state) => state.user);

  //tim user tu list lay ra tu redux store
  const currentUser = users.find((c) => c.id === parseInt(id));
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

  const NewItemSchema = Yup.object().shape({
    username: Yup.string().required("Required, please enter."),
    fullname: Yup.string().required("Required, please enter."),
    password: Yup.string().required("Required, please enter."),
    email: Yup.string().required("Required, please enter."),
    phoneNumber: Yup.string().required("Required, please enter."),
  });

  //ham hook
  // let [category, setCategory] = useState({
  //     name: ""
  // });

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues: currentUser,
  });

  const handleFilterRole = (value) => {
    dispatch(setRoleSearch({ ...searchRole, value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getRoleIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchRole]);

  const save = async (user) => {
    //console.log("user add new; ",JSON.stringify(user.birthdate));
    let formData = new FormData();
    formData.append("id", `${user.id}`);
    formData.append("username", `${user.username}`);
    formData.append("fullname", `${user.fullname}`);
    formData.append("password", `${user.password}`);
    formData.append("email", `${user.email}`);
    formData.append("address", `${user.address}`);
    formData.append("birthdate", `${user.birthdate}`);
    console.log(`${user.birthdate}`);
    formData.append("gender", `${user.gender}`);
    formData.append("phoneNumber", `${user.phoneNumber}`);
    user.roles.forEach((item, index) => {
      formData.append(`roles[${index}].id`, item.id);
    });
    formData.append("file", selectedFile);
    let { code } = await updateUserAPI(formData);
    if (code === 200) {
      toast("Thanh cong!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored", 
      });
      navigate("/dashboard/user/search");
    } else showError(code);
  };

  return (
    <Grid container alignItems={"center"} justifyContent={"center"}>
      <Grid item xs={12} sm={6}>
        <Stack spacing={3}>
          <Typography variant="h6">Create User</Typography>
          <form onSubmit={handleSubmit(save)}>
            <Stack spacing={3}>
              <TextField
                label="ID người dùng"
                variant="outlined"
                disabled
                size="small"
                {...register("id")}
              />
              <TextField
                label="Tên đăng nhập"
                variant="outlined"
                disabled
                size="small"
                {...register("username")}
              />
              <TextField
                label="Họ và tên"
                variant="outlined"
                size="small"
                {...register("fullname")}
              />
              <TextField
                label="Mật khẩu"
                variant="outlined"
                size="small"
                type="password"
                {...register("password")}
              />

              <TextField
                label="Số Điện Thoại"
                variant="outlined"
                size="small"
                {...register("phoneNumber")}
              />
              <TextField
                label="Email"
                variant="outlined"
                size="small"
                {...register("email")}
              />
              <TextField
                label="Địa chỉ"
                variant="outlined"
                size="small"
                {...register("address")}
              />
              <FormControl component="fieldset" style={marginTop}>
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender"
                  
                  style={{ display: "initial" }}
                >
                  <FormControlLabel
                    value="Nữ"
                    {...register("gender")}
                    control={<Radio />}
                    label="Nữ"
                  />
                  <FormControlLabel
                    value="Nam"
                    {...register("gender")}
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="Khác"
                    control={<Radio />}
                    label="Khác"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                label="Ngày sinh (dd/mm/yyyy)"
                variant="outlined"
                size="small"
                type="text"
                name="birthdate"
                max="31/12/2023"
                {...register("birthdate")}
              />
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={roles.map(({ id, name }) => ({ id, name }))}
                    getOptionLabel={(option) => option?.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingRole}
                    onInputChange={(_, value) => {
                      handleFilterRole(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option?.name}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField label="ROLE" {...params} />
                    )}
                  />
                )}
              />

              <Button variant="contained" component="label">
                <input
                  accept="image/*"
                  multiple
                  type="file"
                  name="file"
                  onChange={handleChange}
                />
              </Button>

              <Button variant="outlined" type="submit">
                Cập nhật người dùng
              </Button>
            </Stack>
          </form>
        </Stack>
      </Grid>
    </Grid>
  );
}
