import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Button,
  IconButton
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createUserAPI } from "../../service/user.service";
import { React, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoleIds, setRoleSearch } from "../../redux/roleSlice";
import { useEffect } from "react";

export default function NewUser() {
  let navigate = useNavigate();
  const marginTop = { marginTop: 5 };
  const { showError } = useError();
  const {
    roles,
    search: searchRole,
    isLoading: isLoadingRole,
  } = useSelector((state) => state.role);
  let dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState();

  function handleChange(event) {
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
    password: Yup.string().required("Required, please enter."),
    email: Yup.string().required("Required, please enter."),
    phoneNumber: Yup.string().required("Required, please enter."),
  });

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(NewItemSchema),
  });

  const addNew = async (user) => {
    let formData = new FormData();
    formData.append("username", `${user.username}`);
    formData.append("fullname", `${user.fullname}`);
    formData.append("password", `${user.password}`);
    formData.append("email", `${user.email}`);
    formData.append("address", `${user.address}`);
    formData.append("birthdate", `${user.birthdate}`);
    formData.append("gender", `${user.gender}`);

    formData.append("phoneNumber", `${user.phoneNumber}`);
    user.roles.forEach((item, index) => {
      formData.append(`roles[${index}].id`, item.id);
    });

    formData.append("file", selectedFile);
    let { code } = await createUserAPI(formData);
    if (code === 200) {
      toast("Thanh cong !!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      navigate("/dashboard/user/search");
    } else showError(code);
  };

  return (
    <Stack alignItems={"center"} justifyItems={"center"}>
      <Stack spacing={3} sx={{ maxWidth: 500 }} >
        <Typography variant="h6">Create User</Typography>
        <form onSubmit={handleSubmit(addNew)}>
        <Stack spacing={3}>
          <TextField
            label="Tên đăng nhập"
            variant="outlined"
            size="small"
            {...register("username")}
          />
          <TextField
            label="Họ và tên"
            {...register("fullname")}
            margin="normal"
            fullWidth
            placeholder="Enter your fullname"
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
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
                renderInput={(params) => <TextField label="ROLE" {...params} />}
              />
            )}
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
              <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Ngày sinh (dd/mm/yyyy)"
            variant="outlined"
            size="small"
            type="text"
            id="birthdate"
            name="birthdate"
            placeholder="dd/mm/yyyy"
            max="2030/12/31"
            {...register("birthdate")}
          />

          <input
            accept="*"
            multiple
            type="file"
            name="file"
            onChange={handleChange}
          />

          <Button variant="contained" type="submit">
            Thêm người dùng
          </Button>
        </Stack>
        </form>
      </Stack>
    </Stack>
  );
}
