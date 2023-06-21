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
import { createFacultyAPI } from "../../service/faculty.service";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMajorIds, setMajorSearch } from "../../redux/majorSlice";
import { getTeacherIds, setTeacherSearch } from "../../redux/teacherSlice";
import { createClassesAPI } from "../../service/classes.service";

export default function NewClasses() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const { showError } = useError();
  const { classes, recordsFiltered, search, error } = useSelector(
    (state) => state.classs
  );
  const {
    majors,
    search: searchMajor,
    isLoading: isLoadingMajor,
  } = useSelector((state) => state.major);
  const {
    teachers,
    search: searchTeacher,
    isLoading: isLoadingTeacher,
  } = useSelector((state) => state.teacher);

  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required("Required, please enter."),
    major: Yup.object().nullable().required("Phải nhập ô này"),
    teacher: Yup.object().nullable().required("Phải nhập ô này"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(NewItemSchema),
  });

  useEffect(()=>{
    handleFilterTitleMajor("")
  },[])

  useEffect(()=>{
    handleFilterTitleTeacher("")
  },[])

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getMajorIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchMajor]);

  const handleFilterTitleMajor = (value) => {
    dispatch(setMajorSearch({ ...searchMajor, value }));
  };

  const handleFilterTitleTeacher = (value) => {
    dispatch(setTeacherSearch({ ...searchTeacher, value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getTeacherIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchTeacher]);

  const handleChange = (e) => {
    let newSearch = {
      ...search,
      start: 0, // reset lai trang dau
      [e.target.name]: e.target.value,
    };
    dispatch(setMajorSearch(newSearch));
  };

  const addNew = async (classes) => {
    let { code } = await createClassesAPI(classes);

    if (code === 200) {
      toast("Thành công!!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      navigate("/dashboard/classes/search");
    } else if(code !== 200){
      toast("Access Denied!!!",{
      position: toast.POSITION.TOP_RIGHT,
      type: "error",
      theme: "colored",
      });
    }
  };

  return (
    <Grid container alignItems={"center"} justifyContent={"center"}>
      <Grid item xs={12} sm={6}>
        <Stack spacing={3}>
          <Typography variant="h6">Create Class</Typography>
          <form onSubmit={handleSubmit(addNew)}>
            <Stack spacing={3}>
              <TextField
                label="Tên Lớp"
                variant="outlined"
                size="small"
                {...register("name")}
              />
              <Controller
                name="major"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={majors.map(({ id, title }) => ({
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
                        label="Tên chuyên ngành"
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="teacher"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={teachers}
                    getOptionLabel={(option) => option?.user?.fullname}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingTeacher}
                    onInputChange={(event, value) => {
                      handleFilterTitleTeacher(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option.user.fullname}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Tên giảng viên"
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

