import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { updateStudentAPI } from "../../service/student.service";
import { getUserIds, setUserSearch } from "../../redux/userSlice";
import { useEffect } from "react";
import { getMajorIds, setMajorSearch } from "../../redux/majorSlice";
import { getClassesIds, setClasssSearch } from "../../redux/classesSlice";

export default function EditStudent() {
  const { showError } = useError();
  let dispatch = useDispatch();

  let navigate = useNavigate();

  let { id } = useParams();
  const { students } = useSelector((state) => state.student);
  const {
    users,
    search: searchUser,
    isLoading: isLoadingUser,
  } = useSelector((state) => state.user);
  const {
    majors,
    search: searchMajor,
    isLoading: isLoadingMajor,
  } = useSelector((state) => state.major);
  const {
    classes,
    search: searchClasss,
    isLoading: isLoadingClasses,
  } = useSelector((state) => state.classs);

  const handleFilterTitleUser = (value) => {
    if (value !== searchUser.value)
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
      dispatch(getMajorIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchMajor]);

  const handleFilterTitleMajor = (value) => {
    if (value !== searchMajor.value)
      dispatch(setMajorSearch({ ...searchMajor, value }));
  };

  useEffect(() => {
    handleFilterTitleMajor("");
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getClassesIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchMajor]);

  const handleFilterTitleClasses = (value) => {
    if (value !== searchClasss.value)
      dispatch(setClasssSearch({ ...searchClasss, value }));
  };

  useEffect(() => {
    handleFilterTitleClasses("");
  }, []);

  //tim student tu list lay ra tu redux store
  const currentStudent = students.find((c) => c.id === parseInt(id));

  const NewItemSchema = Yup.object().shape({
    // name: Yup.string().required("Required, please enter."),
    // id: Yup.number().moreThan(0, "Required number, please enter."),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues: currentStudent,
  });

  const save = async (student) => {
    let { code } = await updateStudentAPI(student);

    if (code === 200) {
      toast("Thanh cong!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      navigate("/dashboard/student/search");
    } else showError(code);
  };
  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Stack spacing={3}>
          <h2>Update Student</h2>

          <form onSubmit={handleSubmit(save)}>
            <Stack spacing={3}>
              <TextField
                label="ID sinh viên"
                variant="outlined"
                size="small"
                disabled
                {...register("id")}
              />
              <TextField
                label="Mã sinh viên"
                variant="outlined"
                size="small"
                {...register("studentCode")}
              />

              <Controller
                name="user"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    disabled
                    options={users.map(({ id, fullname }) => ({
                      id,
                      fullname,
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
                name="major"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={majors?.map(({ id, title }) => ({
                      id,
                      title,
                    }))}
                    getOptionLabel={(option) => option.title}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingMajor}
                    onInputChange={(event, value) => {
                      handleFilterTitleMajor(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option.title}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Tên ngành học"
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="studentClass"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={classes?.map(({ id, name }) => ({
                      id,
                      name,
                    }))}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingMajor}
                    onInputChange={(event, value) => {
                      handleFilterTitleClasses(value);
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
                        label="Tên lớp"
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <Button variant="outlined" type="submit">
                Update
              </Button>
            </Stack>
          </form>
        </Stack>
      </Grid>
    </Grid>
  );
}
