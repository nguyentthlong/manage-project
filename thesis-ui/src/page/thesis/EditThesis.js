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
import { updateThesisAPI } from "../../service/thesis.service";
import { useEffect } from "react";
import {
  getStudentIds,
  searchStudent,
  setStudentSearch,
} from "../../redux/studentSlice";
import {
  getTeacherIds,
  searchTeacher,
  setTeacherSearch,
} from "../../redux/teacherSlice";

export default function EditThesis() {
  const { showError } = useError();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const {
    students,
    search: searchStudent,
    isLoading: isLoadingStudent,
  } = useSelector((state) => state.student);
  const {
    teachers,
    search: searchTeacher,
    isLoading: isLoadingTeacher,
  } = useSelector((state) => state.teacher);
  let { id } = useParams();
  const { theses } = useSelector((state) => state.thesis);

  //tim thesis tu list lay ra tu redux store
  const currentThesis = theses.find((c) => c.id === parseInt(id));

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
    defaultValues: currentThesis,
  });

  const handleFilterTitleStudent = (value) => {
    if (value !== searchStudent.value)
      dispatch(setStudentSearch({ ...searchStudent, value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getStudentIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchStudent]);

  const handleFilterTitleTeacher = (value) => {
    if (value !== searchTeacher.value)
      dispatch(setTeacherSearch({ ...searchTeacher, value }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getTeacherIds());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, searchTeacher]);

  const save = async (thesis) => {
    let { code } = await updateThesisAPI(thesis);

    if (code === 200) {
      toast("Thanh cong!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      navigate("/dashboard/thesis/search");
    } else showError(code);
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Stack spacing={3}>
          <h2>Update Thesis</h2>

          <form onSubmit={handleSubmit(save)}>
            <Stack spacing={3}>
              <TextField
                label="Tên luận án"
                variant="outlined"
                size="small"
                {...register("title")}
              />
              <TextField
                label="Mô tả luận án"
                variant="outlined"
                size="small"
                {...register("description")}
              />
              <Controller
                name="student"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={students}
                    getOptionLabel={(option) => option?.user?.fullname}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingStudent}
                    onInputChange={(event, value) => {
                      handleFilterTitleStudent(value);
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
                        label="Tên sinh viên"
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

              <Button type="submit">Update</Button>
            </Stack>
          </form>
        </Stack>
      </Grid>
    </Grid>
  );
}
