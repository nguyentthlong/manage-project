import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createTeacherAPI } from "../../service/teacher.service";
import { useDispatch, useSelector } from "react-redux";
import { getUserById, getUserIds, setUserSearch } from "../../redux/userSlice";
import { getFacultyIds, setFacultySearch } from "../../redux/facultySlice";
import { useEffect } from "react";

export default function NewTeacher() {
  let navigate = useNavigate();
  const { showError } = useError();
  let dispatch = useDispatch();
  const { users, search: searchUser, isLoading: isLoadingUser,} = useSelector((state) => state.user);
  const { faculties, search: searchFaculty, isLoading: isLoadingFaculty,} = useSelector((state) => state.faculty);


  const NewItemSchema = Yup.object().shape({
    // name: Yup.string().required("Required, please enter."),
    user: Yup.object().nullable().required("Phải nhập ô này"),
    faculty: Yup.object().nullable().required("Phải nhập ô này"),

  });
  
  
  
  const handleFilterTitleUser = (value) => {
    dispatch(setUserSearch({ ...searchUser, value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getUserIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getFacultyIds());
    }, 500);
    console.log("ggg")
    return () => clearTimeout(timeout);
  }, [dispatch, searchFaculty]);

  const handleFilterTitleFaculty = (value) => {
    dispatch(setFacultySearch({ ...searchFaculty, value }));
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(NewItemSchema),
  });

  const addNew = async (teacher) => {
    let { code } = await createTeacherAPI(teacher);

    if (code === 200) {
      toast("Thanh cong!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      navigate("/dashboard/teacher/search");
    } else showError(code);
  };

  return (
    <Grid container alignItems={"center"} justifyContent={"center"}>
      <Grid item xs={12} sm={6}>
        <Stack spacing={3}>
          <Typography variant="h6">Create Teacher</Typography>
          <form onSubmit={handleSubmit(addNew)}>
            <Stack spacing={3}>
              <TextField
                label="ID giáo viên"
                variant="outlined"
                size="small"
                {...register("id")}
              />
              <TextField
                label="Mã giáo viên"
                variant="outlined"
                size="small"
                {...register("teacherCode")}
              />
              
              <Controller
                name="user"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}

                    options={users.map(({ id , fullname}) => ({
                      id,fullname
                    }))}
                    getOptionLabel={(option) => option.fullname}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingUser}
                    onInputChange={(event, value) => {
                      handleFilterTitleUser(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option.fullname}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Tên người dùng"
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="faculty"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={faculties?.map(({ id, name }) => ({
                      id, name
                    }))}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingFaculty}
                    onInputChange={(event, value) => {
                      handleFilterTitleFaculty(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option.name}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Tên Khoa/Viện"
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <Button variant="outlined" type="submit">
                Create
              </Button>
            </Stack>
          </form>
        </Stack>
      </Grid>
    </Grid>
  );
}
